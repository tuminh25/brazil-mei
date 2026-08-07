// scripts/import-folder.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const QUEUE_DIR = path.join(__dirname, '../content-queue');

// Danh sách category hợp lệ từ PostCategory enum (theo prisma/schema.prisma)
const VALID_CATEGORIES = [
  'HOUSING', 'TRANSPORT', 'MONEY', 'STUDY', 'HEALTHCARE',
  'FOOD', 'WORK', 'LIFESTYLE', 'NEIGHBORHOOD', 'TOOLS', 'TRAVEL_GUIDE'
];

// Map content-queue category names to Prisma PostCategory enum values
function mapCategory(category) {
  if (!category) return 'HOUSING';
  
  const normalized = category.trim().toUpperCase();
  
  // Direct match (case-insensitive)
  if (VALID_CATEGORIES.includes(normalized)) {
    return normalized;
  }
  
  // Map common variations from content-queue format
  const categoryMap = {
    'HOUSING': 'HOUSING',
    'MONEY': 'MONEY',
    'HEALTHCARE': 'HEALTHCARE',
    'TRANSPORT': 'TRANSPORT',
    'TRANSPORT & DAILY LIFE': 'TRANSPORT',
    'WORK': 'WORK',
    'WORK & STUDY': 'WORK',
    'STUDY': 'STUDY',
    'FOOD': 'FOOD',
    'FOOD & COMMUNITY': 'FOOD',
    'LIFESTYLE': 'LIFESTYLE',
    'NEIGHBORHOOD': 'NEIGHBORHOOD',
    'TOOLS': 'TOOLS',
    'TRAVEL_GUIDE': 'TRAVEL_GUIDE',
  };
  
  return categoryMap[normalized] || 'HOUSING';
}

// Map category to editorial team author ID
function mapCategoryToAuthor(category) {
  const normalized = mapCategory(category);
  
  const authorMap = {
    'HOUSING': 'author_housing',
    'MONEY': 'author_money',
    'HEALTHCARE': 'author_healthcare',
    'TRANSPORT': 'author_transport',
    'WORK': 'author_work',
    'STUDY': 'author_work',
    'FOOD': 'author_food',
    'LIFESTYLE': 'author_editorial',
    'NEIGHBORHOOD': 'author_food',
    'TOOLS': 'author_research',
    'TRAVEL_GUIDE': 'author_editorial',
  };
  
  return authorMap[normalized] || 'author_editorial';
}

// Clean article content: remove AI instruction sections and metadata
function cleanArticleContent(html) {
  if (!html) return '';
  
  // Remove AI metadata blocks that appear before the article title
  // These include: Primary Keyword, Secondary Keywords, Related Keywords, Search Intent, SEO Notes, Writing Notes
  // And the separator line: ==================================================
  
  // Find the first <h1> tag which marks the start of the actual article
  const h1Index = html.indexOf('<h1>');
  if (h1Index !== -1) {
    // Keep only from the first <h1> onwards
    html = html.substring(h1Index);
  }
  
  // Remove everything starting from "Suggested Internal Links"
  const suggestedLinksIndex = html.indexOf('<h2>Suggested Internal Links</h2>');
  if (suggestedLinksIndex !== -1) {
    html = html.substring(0, suggestedLinksIndex);
  }
  
  // Remove everything starting from "Recommended Schema"
  const recommendedSchemaIndex = html.indexOf('<h2>Recommended Schema</h2>');
  if (recommendedSchemaIndex !== -1) {
    html = html.substring(0, recommendedSchemaIndex);
  }
  
  // Also handle case where they might be in different case
  const suggestedLinksIndexLower = html.toLowerCase().indexOf('<h2>suggested internal links</h2>');
  if (suggestedLinksIndexLower !== -1 && suggestedLinksIndex === -1) {
    html = html.substring(0, suggestedLinksIndexLower);
  }
  
  const recommendedSchemaIndexLower = html.toLowerCase().indexOf('<h2>recommended schema</h2>');
  if (recommendedSchemaIndexLower !== -1 && recommendedSchemaIndex === -1) {
    html = html.substring(0, recommendedSchemaIndexLower);
  }
  
  return html.trim();
}

const KLOOK_AID = '105111';
const TRIP_ALLIANCE_ID = '7367361';
const TRIP_SID = '278066643';

function generateSlug(text) {
  return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').substring(0, 100);
}

// Clean plain text excerpt: remove AI metadata lines
function cleanExcerptText(text) {
  if (!text) return '';
  
  // Remove lines starting with "Secondary Keywords:", "Primary Keyword:", etc.
  // Remove separator lines
  // Remove "From an EEAT" and everything after
  // Remove ALL bullet points (excerpt should be a summary, not a keyword list)
  let cleaned = text
    .split('\n')
    .filter(line => {
      const trimmed = line.trim();
      // Skip metadata header lines
      if (trimmed.startsWith('Secondary Keywords:')) return false;
      if (trimmed.startsWith('Primary Keyword:')) return false;
      if (trimmed.startsWith('Related Keywords:')) return false;
      if (trimmed.startsWith('Search Intent:')) return false;
      if (trimmed.startsWith('SEO Notes:')) return false;
      if (trimmed.startsWith('Writing Notes:')) return false;
      if (trimmed === '==================================================') return false;
      if (trimmed.startsWith('From an EEAT')) return false;
      // Skip ALL bullet points
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) return false;
      return true;
    })
    .join('\n')
    .trim();
  
  // Also handle "From an EEAT" in the middle of text
  const eeatIndex = cleaned.indexOf('From an EEAT');
  if (eeatIndex !== -1) {
    cleaned = cleaned.substring(0, eeatIndex).trim();
  }
  
  return cleaned;
}

async function runBatchImport() {
  try {
    console.log('🚀 KHỞI ĐỘNG CỖ MÁY IMPORT EVERGREEN...');
    
    if (!fs.existsSync(QUEUE_DIR)) return console.error("❌ Folder content-queue trống!");

    const files = fs.readdirSync(QUEUE_DIR).filter(file => file.endsWith('.json'));
    console.log(`📊 Tìm thấy ${files.length} file.`);

    for (const file of files) {
      try {
        const rawContent = fs.readFileSync(path.join(QUEUE_DIR, file), 'utf8');
        let data = JSON.parse(rawContent);
        if (Array.isArray(data)) data = data[0];

        const name = data.name || data.title;
        const slug = data.slug || generateSlug(name);
        
        // Assign author based on category for editorial team system
        const category = mapCategory(data.category);
        const authorId = mapCategoryToAuthor(data.category);

        console.log(`\n📄 Đang xử lý: ${name} | Category: ${category} | Author: ${authorId}`);

        // Image: use imageUrl from JSON, otherwise category-specific placeholder
        let imageUrl = data.imageUrl;
        if (!imageUrl) {
          const categoryPlaceholders = {
            'HOUSING': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200',
            'MONEY': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200',
            'HEALTHCARE': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200',
            'TRANSPORT': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200',
            'WORK': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200',
            'STUDY': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200',
            'FOOD': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200',
            'LIFESTYLE': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200',
            'NEIGHBORHOOD': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200',
            'TOOLS': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200',
            'TRAVEL_GUIDE': 'https://images.unsplash.com/photo-1525625239513-39bc131f9979?w=1200',
          };
          imageUrl = categoryPlaceholders[category] || 'https://images.unsplash.com/photo-1525625239513-39bc131f9979?w=1200';
        }

        // SMART MAPPING: Ánh xạ các trường thông minh
        const insiderPrice = data.insiderPrice || data.price || data.ticketPrice || null;
        const bestTime = data.bestTime || data.timing || data.openingHours || data.bestVisitTime || null;
        
        // Xử lý secretTip: Nếu là object (aiSmartTips) thì chuyển thành text hoặc lấy chuỗi
        let secretTip = data.secretTip || data.tips || data.aiSmartTips;
        if (typeof secretTip === 'object' && secretTip !== null) {
          secretTip = JSON.stringify(secretTip).substring(0, 500); // Rút gọn nếu là object
        }

        // Clean content: remove AI instruction sections
        const rawContentHtml = data.description || data.content || "";
        const cleanContent = cleanArticleContent(rawContentHtml).split(/From an EEAT/i)[0].trim();
        
        // Clean excerpt: remove AI metadata (Secondary Keywords, etc.)
        const rawExcerpt = data.aiSummary || data.excerpt || name.substring(0, 160);
        let cleanExcerpt = cleanExcerptText(rawExcerpt);
        // Fallback: if excerpt is empty after cleaning, generate from content
        if (!cleanExcerpt) {
          // Extract first paragraph after H1 from cleanContent
          const firstParaMatch = cleanContent.match(/<h1[^>]*>.*?<\/h1>\s*<h2[^>]*>.*?<\/h2>\s*<p>(.*?)<\/p>/i);
          if (firstParaMatch) {
            cleanExcerpt = firstParaMatch[1].replace(/<[^>]*>/g, '').substring(0, 160);
          } else {
            cleanExcerpt = name.substring(0, 160);
          }
        }

        const postData = {
          slug: slug,
          title: name,
          content: cleanContent,
          imageUrl: imageUrl,
          excerpt: cleanExcerpt,
          category: category,
          authorId: authorId,    
          isNewsjack: false,
          status: 'PUBLISHED',
          insiderPrice: insiderPrice,
          bestTime: bestTime,
          secretTip: secretTip,
          updatedAt: new Date()
        };

        await prisma.post.upsert({
          where: { slug: slug },
          update: postData,
          create: postData
        });

        console.log(`✅ Thành công: ${name} | Category: ${category} | Author: ${authorId}`);

      } catch (e) { console.error(`❌ Lỗi file ${file}:`, e.message); }
    }
    console.log('\n🎉 TẤT CẢ ĐÃ LÊN SÓNG MƯỢT MÀ!');
    
    // BƯỚC CUỐI: Gọi revalidate (Sử dụng API đã tạo)
    try {
      console.log('🔄 Đang kích hoạt revalidate...');
      console.log('👉 Tip: Truy cập /api/revalidate?path=/&secret=BOSS2026 để xóa cache ngay.');
    } catch (revalidateError) {
      console.error('⚠️ Không thể tự động revalidate:', revalidateError.message);
    }

  } catch (err) { console.error('💥 Lỗi hệ thống:', err.message); } finally { await prisma.$disconnect(); }
}

runBatchImport();