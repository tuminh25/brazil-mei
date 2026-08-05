// scripts/publish_article.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { findImage } = require('./lib/image-provider');
const prisma = new PrismaClient();

/**
 * Publishes an article JSON object.
 * @param {object} article - all Post fields (title, slug, content, category, etc.)
 * @param {boolean} [skipRevalidate=false] - if true, skip revalidation (for testing)
 */
async function publishArticle(article, skipRevalidate = false) {
  // Ensure author exists (using author_1 as system author)
  const authorId = 'author_1';
  await prisma.author.upsert({
    where: { id: authorId },
    update: {},
    create: {
      id: authorId,
      name: 'Desmond Ho',
      role: 'Chief Editor',
      bio: 'System-generated content.',
    },
  });

  // Slug collision handling: append -2, -3 etc.
  let finalSlug = article.slug;
  let suffix = 1;
  while (true) {
    const exists = await prisma.post.findUnique({ where: { slug: finalSlug } });
    if (!exists) break;
    suffix++;
    finalSlug = `${article.slug}-${suffix}`;
  }

  // Image: if not provided, try to find one
  let imageUrl = article.imageUrl || null;
  if (!imageUrl) {
    const query = article.title || article.topic;
    imageUrl = await findImage(query);
  }

  const postData = {
    slug: finalSlug,
    title: article.title,
    excerpt: article.excerpt || null,
    content: article.content,
    imageUrl,
    category: article.category,
    neighborhood: article.neighborhood || null,
    tags: article.tags || [],
    status: 'PUBLISHED',
    authorId,
    isNewsjack: false,
    insiderPrice: article.insiderPrice || null,
    bestTime: article.bestTime || null,
    secretTip: article.secretTip || null,
    tripUrl: article.tripUrl || null,
    klookUrl: article.klookUrl || null,
    metaTitle: article.metaTitle || null,
    metaDescription: article.metaDescription || null,
  };

  await prisma.post.create({ data: postData });
  console.log(`✅ Published: ${finalSlug}`);

  if (!skipRevalidate) {
    await triggerRevalidation(postData);
  }
  return postData;
}

async function triggerRevalidation(post) {
  const base = process.env.SITE_URL || 'http://localhost:3000';
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    console.warn('⚠️ REVALIDATE_SECRET not set, skipping revalidation');
    return;
  }

  const paths = [
    `/guides/${post.slug}`,
    '/guides',
    `/guides?category=${post.category}`,
    '/latest',
    '/sitemap.xml',
  ];
  if (post.neighborhood) {
    // guess the neighborhood slug (simple lowercase, replace spaces)
    const hoodSlug = post.neighborhood.toLowerCase().replace(/\s+/g, '-');
    paths.push(`/neighborhoods/${hoodSlug}`);
    paths.push('/neighborhoods');
  }

  try {
    const res = await fetch(`${base}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paths, secret }),
    });
    if (!res.ok) throw new Error(`Revalidation failed: ${res.status}`);
    console.log('🔄 Revalidation triggered');
  } catch (e) {
    console.error('⚠️ Revalidation error:', e.message);
  }
}

module.exports = { publishArticle };

// CLI test
if (require.main === module) {
  const articleJson = process.argv[2];
  if (!articleJson) {
    console.error('Usage: node publish_article.js <article.json>');
    process.exit(1);
  }
  const article = JSON.parse(require('fs').readFileSync(articleJson, 'utf8'));
  publishArticle(article)
    .then(() => process.exit(0))
    .catch(e => {
      console.error(e);
      process.exit(1);
    });
}