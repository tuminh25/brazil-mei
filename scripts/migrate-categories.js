// scripts/migrate-categories.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CATEGORY_KEYWORDS = {
  HOUSING: [
    'hdb', 'bto', 'resale', 'flat', 'housing', 'rent', 'rental', 'lease', 'mortgage',
    'home loan', 'cpf housing', 'housing grant', 'en bloc', 'condo', 'ec', 'executive condo',
    'property', 'buying', 'purchase', 'downpayment', 'stamp duty', 'absd', 'ssd',
    'hdb loan', 'bank loan', 'refinance', 'home ownership', 'eligibility', 'income ceiling',
    'mature estate', 'non-mature', 'balloting', 'queue', 'sbf', 'sale of balance flats',
    'replacement flat', 'selective en bloc', 'sers', 'upgrading', 'downgrading'
  ],
  TRANSPORT: [
    'mrt', 'lrt', 'bus', 'transport', 'transportation', 'commute', 'ez-link', 'simplygo',
    'fare', 'concession', 'monthly pass', 'taxi', 'grab', 'gojek', 'ryde', 'tada',
    'cob', 'ert', 'cbd', 'expressway', 'pie', 'aye', 'cte', 'kje', 'tpe', 'sle', 'bke',
    'parking', 'hdb parking', 'season parking', 'car', 'coe', 'erp', 'electronic road pricing',
    'mrt station', 'interchange', 'bus stop', 'bus interchange', 'cycling', 'pcn',
    'park connector', 'walking distance', 'last mile', 'first mile'
  ],
  MONEY: [
    'cpf', 'central provident fund', 'oa', 'sa', 'ma', 'ra', 'ordinary account', 'special account',
    'mediSave', 'retirement account', 'cash', 'investment', 'invest', 'stocks', 'etf', 'reits',
    'savings', 'interest rate', 'compound', 'retirement', 'retire', 'pension', 'annuity',
    'cprs', 'cprs life', 'lifelong income', 'withdrawal', 'top-up', 'voluntary contribution',
    'mandatory contribution', 'salary', 'bonus', 'aws', '13th month', 'tax', 'iras', 'income tax',
    'tax relief', 'tax rebate', 'gst', 'voucher', 'cdc voucher', 'assurance package',
    'cost of living', 'inflation', 'budget', 'financial planning', 'emergency fund',
    'insurance', 'integrated shield', 'medishield', 'careShield', 'elderShield'
  ],
  STUDY: [
    'school', 'primary', 'secondary', 'junior college', 'jc', 'polytechnic', 'poly', 'ite',
    'university', 'nus', 'ntu', 'smu', 'sutd', 'sit', 'suss', 'moe', 'ministry of education',
    'psle', 'o-level', 'a-level', 'n-level', 'streaming', 'subject-based banding', 'sbb',
    'direct school admission', 'dsa', 'phase 1', 'phase 2', 'phase 3', 'registration',
    'school fees', 'edusave', 'post-secondary', 'scholarship', 'bursary', 'financial aid',
    'cce', 'character citizenship', 'cce', 'home-based learning', 'hbl', 'tuition',
    'enrichment', 'cca', 'co-curricular', 'student', 'parent', 'education'
  ],
  HEALTHCARE: [
    'clinic', 'polyclinic', 'hospital', 'gp', 'general practitioner', 'specialist', 'referral',
    'medishield', 'careshield', 'eldershield', 'medisave', 'chronic disease', 'cdmp',
    'community health assist scheme', 'chas', 'blue card', 'orange card', 'green card',
    'pioneer generation', 'merdeka generation', 'subsidy', 'means testing', 'ward class',
    'a&e', 'accident emergency', 'appointment', 'queue', 'telemedicine', 'video consult',
    'health screening', 'check-up', 'vaccination', 'flu', 'covid', 'dengue', 'hand foot mouth',
    'mental health', 'counselling', 'therapy', 'psychiatrist', 'psychologist', 'samh', 'imh',
    'dental', 'dentist', 'orthodontist', 'braces', 'wisdom tooth', 'scaling', 'polishing'
  ],
  FOOD: [
    'hawker', 'hawker centre', 'food centre', 'market', 'wet market', 'supermarket', 'grocery',
    'kopitiam', 'coffee shop', 'cafe', 'restaurant', 'dine', 'takeaway', 'delivery',
    'foodpanda', 'grabfood', 'deliveroo', 'whyq', 'chop', 'cai png', 'economic rice',
    'chicken rice', 'laksa', 'char kway teow', 'hokkien mee', 'bak chor mee', 'wanton mee',
    'roti prata', 'nasi lemak', 'nasi padang', 'briyani', 'dim sum', 'yum cha', 'steamboat',
    'hotpot', 'bbq', 'korean', 'japanese', 'western', 'burger', 'pizza', 'pasta',
    'vegetarian', 'vegan', 'halal', 'muslim', 'certified', 'muis', 'michelin', 'bib gourmand',
    'price', 'inflation', 'cost', 'cheap', 'affordable', 'value', 'queue', 'waiting time'
  ],
  WORK: [
    'work', 'job', 'career', 'employment', 'salary', 'wage', 'bonus', 'increment', 'promotion',
    'resignation', 'retrenchment', 'layoff', 'unemployment', 'job search', 'interview',
    'resume', 'cv', 'linkedin', 'skillsfuture', 'training', 'upskilling', 'reskilling',
    'wsq', 'workforce singapore', 'wsg', 'employment act', 'cpf contribution', 'overtime',
    'ot', 'annual leave', 'sick leave', 'hospitalisation leave', 'maternity', 'paternity',
    'childcare leave', 'eldercare leave', 'flexible work', 'work from home', 'wfh', 'hybrid',
    'ep', 'employment pass', 's pass', 'work permit', 'wp', 'foreign worker', 'quota', 'levy',
    'fair consideration framework', 'fcf', 'jobs bank', 'mycareersfuture', 'career conversion',
    'profession', 'industry', 'sector', 'tech', 'finance', 'healthcare', 'education', 'engineering'
  ],
  LIFESTYLE: [
    'lifestyle', 'recreation', 'leisure', 'hobby', 'interest', 'club', 'community', 'cc',
    'community club', 'residents committee', 'rc', 'neighbourhood', 'neighborhood',
    'park', 'garden', 'nature reserve', 'reservoir', 'beach', 'east coast', 'sentosa',
    'shopping', 'mall', 'plaza', 'centre', 'orchard', 'vivo', 'jewel', 'bugis', 'chinatown',
    'library', 'nlb', 'national library', 'book', 'reading', 'exhibition', 'museum', 'gallery',
    'art', 'culture', 'heritage', 'festival', 'celebration', 'chinese new year', 'cny',
    'hari raya', 'deepavali', 'christmas', 'national day', 'ndp', 'volunteer', 'volunteering',
    'charity', 'donation', 'fundraising', 'sports', 'fitness', 'gym', 'active', 'running',
    'swimming', 'cycling', 'yoga', 'pilates', 'marathon', 'race', 'event', 'workshop', 'class'
  ],
  NEIGHBORHOOD: [
    'woodlands', 'tengah', 'jurong', 'punggol', 'tampines', 'sengkang', 'hougang', 'ang mo kio',
    'bishan', 'toa payoh', 'novena', 'kallang', 'geylang', 'marine parade', 'bedok', 'pasir ris',
    'choa chu kang', 'bukit batok', 'bukit panjang', 'clementi', 'queenstown', 'bukit merah',
    'central', 'downtown', 'marina', 'orchard', 'newton', 'river valley', 'tanglin', 'bukit timah',
    'holland', 'buona vista', 'one-north', 'science park', 'kent ridge', 'pasir panjang',
    'sentosa', 'harbourfront', 'keppel', 'alexandra', 'redhill', 'outam', 'chinatown', 'clarke quay',
    'bugis', 'city hall', 'raffles place', 'tanjong pagar', 'shenton way', 'marina bay', 'bayfront',
    'promenade', 'nicoll highway', 'stadium', 'kallang', 'lavender', 'bencoolen', 'rochor',
    'little india', 'farrer park', 'boon keng', 'potong pasir', 'woodleigh', 'serangoon', 'lorong chuan',
    'bartley', 'tai seng', 'macpherson', 'uppal', 'eunos', 'paya lebar', 'dakota', 'mountbatten',
    'stadium', 'kallang', 'geylang bahru', 'aljunied', 'kembangan', 'bedok', 'fengshan', 'changi',
    'expo', 'changi airport', 'tanah merah', 'simei', 'tampines', 'tampines west', 'tampines east',
    'upper changi', 'simei', 'pasir ris', 'pasir ris east', 'pasir ris west', 'elias', 'downtown',
    'bukit panjang', 'cashew', 'hillview', 'beauty world', 'king albert park', 'sixth avenue',
    'tan kah kee', 'botanic gardens', 'stevens', 'newton', 'orchard', 'somerset', 'dhoby ghaut',
    'city hall', 'raffles place', 'tanjong pagar', 'outam', 'maxwell', 'shenton way', 'marina bay',
    'bayfront', 'promenade', 'nicoll highway', 'stadium', 'mountbatten', 'katong park', 'tanjong katong',
    'marine parade', 'marine terrace', 'siglap', 'bayshore', 'bedok south', 'bedok north', 'kaki bukit',
    'kembangan', 'eunos', 'paya lebar', 'macpherson', 'tai seng', 'bartley', 'serangoon', 'lorong chuan',
    'buangkok', 'sengkang', 'compassvale', 'ranggung', 'kangkar', 'cheng lim', 'farmway', 'kupang',
    'thanggam', 'fernvale', 'layar', 'tongkang', 'renjong', 'sengkang', 'punggol', 'punggol coast',
    'punggol point', 'samudera', 'nibong', 'sumang', 'soo teck', 'sam kee', 'punggol field',
    'punggol central', 'waterway', 'cove', 'plaza', 'oasis', 'arcadia', 'waterway point',
    'northshore', 'cove', 'plaza', 'oasis', 'arcadia', 'waterway point'
  ],
  TOOLS: [
    'calculator', 'tool', 'planner', 'checker', 'finder', 'tracker', 'comparison', 'compare',
    'affordability', 'retirement', 'cpf', 'transport cost', 'school distance', 'hawker price',
    'clinic finder', 'hospital finder', 'salary benchmark', 'neighborhood comparison',
    'budget', 'expense', 'income', 'savings', 'investment', 'loan', 'mortgage', 'refinance'
  ],
  TRAVEL_GUIDE: [
    'tourist', 'tourism', 'visitor', 'travel', 'attraction', 'sightseeing', 'itinerary',
    'hotel', 'hostel', 'accommodation', 'booking', 'trip.com', 'klook', 'agoda', 'booking.com',
    'expedia', 'flight', 'airport', 'changi', 'jewel', 'gardens by the bay', 'marina bay sands',
    'sentosa', 'universal studios', 'uss', 's.e.a aquarium', 'adventure cove', 'cable car',
    'singapore zoo', 'night safari', 'river wonders', 'bird paradise', 'mandai', 'botanic gardens',
    'orchard road', 'shopping', 'ion', 'paragon', 'ngee ann city', 'wisma atria', 'takashimaya',
    'chinatown', 'little india', 'kampong glam', 'arab street', 'haji lane', 'bugis street',
    'clarke quay', 'boat quay', 'robertson quay', 'nightlife', 'bar', 'club', 'pub', 'drink',
    'food tour', 'walking tour', 'bike tour', 'segway', 'duck tour', 'river cruise', 'bumboat',
    'cultural', 'heritage', 'museum', 'national museum', 'art museum', 'peranakan', 'baba nonya',
    'instagram', 'photo', 'photography', 'spot', 'viewpoint', 'skyline', 'sunset', 'sunrise',
    'family', 'kids', 'children', 'family-friendly', 'elderly', 'senior', 'accessible', 'wheelchair'
  ]
};

const NEIGHBORHOOD_KEYWORDS = [
  'woodlands', 'tengah', 'jurong', 'punggol', 'tampines', 'sengkang', 'hougang', 'ang mo kio',
  'bishan', 'toa payoh', 'novena', 'kallang', 'geylang', 'marine parade', 'bedok', 'pasir ris',
  'choa chu kang', 'bukit batok', 'bukit panjang', 'clementi', 'queenstown', 'bukit merah',
  'central', 'downtown', 'marina', 'orchard', 'newton', 'river valley', 'tanglin', 'bukit timah',
  'holland', 'buona vista', 'one-north', 'science park', 'kent ridge', 'pasir panjang',
  'sentosa', 'harbourfront', 'keppel', 'alexandra', 'redhill', 'outam', 'chinatown', 'clarke quay',
  'bugis', 'city hall', 'raffles place', 'tanjong pagar', 'shenton way', 'marina bay', 'bayfront',
  'promenade', 'nicoll highway', 'stadium', 'kallang', 'lavender', 'bencoolen', 'rochor',
  'little india', 'farrer park', 'boon keng', 'potong pasir', 'woodleigh', 'serangoon', 'lorong chuan',
  'bartley', 'tai seng', 'macpherson', 'uppal', 'eunos', 'paya lebar', 'dakota', 'mountbatten',
  'stadium', 'kallang', 'geylang bahru', 'aljunied', 'kembangan', 'bedok', 'fengshan', 'changi',
  'expo', 'changi airport', 'tanah merah', 'simei', 'tampines', 'tampines west', 'tampines east',
  'upper changi', 'simei', 'pasir ris', 'pasir ris east', 'pasir ris west', 'elias', 'downtown',
  'bukit panjang', 'cashew', 'hillview', 'beauty world', 'king albert park', 'sixth avenue',
  'tan kah kee', 'botanic gardens', 'stevens', 'newton', 'orchard', 'somerset', 'dhoby ghaut',
  'city hall', 'raffles place', 'tanjong pagar', 'outam', 'maxwell', 'shenton way', 'marina bay',
  'bayfront', 'promenade', 'nicoll highway', 'stadium', 'mountbatten', 'katong park', 'tanjong katong',
  'marine parade', 'marine terrace', 'siglap', 'bayshore', 'bedok south', 'bedok north', 'kaki bukit',
  'kembangan', 'eunos', 'paya lebar', 'macpherson', 'tai seng', 'bartley', 'serangoon', 'lorong chuan',
  'buangkok', 'sengkang', 'compassvale', 'ranggung', 'kangkar', 'cheng lim', 'farmway', 'kupang',
  'thanggam', 'fernvale', 'layar', 'tongkang', 'renjong', 'sengkang', 'punggol', 'punggol coast',
  'punggol point', 'samudera', 'nibong', 'sumang', 'soo teck', 'sam kee', 'punggol field',
  'punggol central', 'waterway', 'cove', 'plaza', 'oasis', 'arcadia', 'waterway point',
  'northshore', 'cove', 'plaza', 'oasis', 'arcadia', 'waterway point'
];

function classifyCategory(title, excerpt, content) {
  const text = `${title} ${excerpt || ''} ${content || ''}`.toLowerCase();
  
  const scores = {};
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        score += matches.length;
      }
    }
    scores[category] = score;
  }
  
  // Find category with highest score
  let bestCategory = 'TRAVEL_GUIDE';
  let bestScore = 0;
  
  for (const [category, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }
  
  // If no keywords matched, default to TRAVEL_GUIDE
  if (bestScore === 0) {
    return 'TRAVEL_GUIDE';
  }
  
  return bestCategory;
}

function detectNeighborhood(title, excerpt, content) {
  const text = `${title} ${excerpt || ''} ${content || ''}`.toLowerCase();
  
  for (const neighborhood of NEIGHBORHOOD_KEYWORDS) {
    const regex = new RegExp(`\\b${neighborhood.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    if (regex.test(text)) {
      // Return properly capitalized neighborhood name
      return neighborhood.charAt(0).toUpperCase() + neighborhood.slice(1);
    }
  }
  
  return null;
}

async function migrate() {
  console.log('🔍 Fetching all posts...');
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      content: true,
      category: true,
      neighborhood: true,
    }
  });
  
  console.log(`📊 Found ${posts.length} posts to process`);
  
  let updated = 0;
  let skipped = 0;
  const changes = [];
  
  for (const post of posts) {
    const newCategory = classifyCategory(post.title, post.excerpt, post.content);
    const newNeighborhood = detectNeighborhood(post.title, post.excerpt, post.content);
    
    const categoryChanged = post.category !== newCategory;
    const neighborhoodChanged = post.neighborhood !== newNeighborhood && newNeighborhood !== null;
    
    if (categoryChanged || neighborhoodChanged) {
      await prisma.post.update({
        where: { id: post.id },
        data: {
          category: newCategory,
          neighborhood: newNeighborhood || post.neighborhood,
        }
      });
      
      changes.push({
        slug: post.slug,
        title: post.title.substring(0, 60),
        oldCategory: post.category,
        newCategory,
        oldNeighborhood: post.neighborhood,
        newNeighborhood: newNeighborhood || post.neighborhood,
      });
      
      updated++;
      console.log(`✅ Updated: ${post.slug} | ${post.category} → ${newCategory} | Neighborhood: ${post.neighborhood} → ${newNeighborhood || post.neighborhood}`);
    } else {
      skipped++;
      console.log(`⏭️  Skipped: ${post.slug} (no change)`);
    }
  }
  
  console.log('\n📋 Migration Summary:');
  console.log(`   Total posts: ${posts.length}`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped: ${skipped}`);
  
  if (changes.length > 0) {
    console.log('\n📝 Changes:');
    for (const c of changes) {
      console.log(`   - ${c.slug}: ${c.oldCategory} → ${c.newCategory} | Neighborhood: ${c.oldNeighborhood} → ${c.newNeighborhood}`);
    }
  }
  
  // Print category distribution
  const finalPosts = await prisma.post.findMany({
    select: { category: true, neighborhood: true }
  });
  
  const categoryCounts = {};
  const neighborhoodCounts = {};
  
  for (const p of finalPosts) {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    if (p.neighborhood) {
      neighborhoodCounts[p.neighborhood] = (neighborhoodCounts[p.neighborhood] || 0) + 1;
    }
  }
  
  console.log('\n📊 Final Category Distribution:');
  for (const [cat, count] of Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${cat}: ${count}`);
  }
  
  console.log('\n📍 Neighborhood Distribution:');
  for (const [hood, count] of Object.entries(neighborhoodCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${hood}: ${count}`);
  }
  
  await prisma.$disconnect();
}

migrate().catch(async (e) => {
  console.error('❌ Migration failed:', e);
  await prisma.$disconnect();
  process.exit(1);
});