# SG Events Hub v2 - Autonomous Publishing Pipeline Architecture

## Overview
This document describes the future autonomous publishing pipeline for SG Events Hub v2. The pipeline transforms manual research into published, SEO-optimized resident guides with automatic internal linking and cache revalidation.

**Current State**: Architecture prepared, not yet implemented.
**Target**: Fully autonomous publishing from research to live page.

---

## Pipeline Stages

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  RESEARCH   │───▶│  CLEANING   │───▶│  WRITING    │───▶│ SEO OPTIMIZE│───▶│ INTERNAL    │───▶│  IMAGE      │───▶│  PUBLISH    │───▶│ REVALIDATE  │
│  (Manual)   │    │  (Auto)     │    │  (AI)       │    │  (AI)       │    │  LINKING    │    │  (Auto)     │    │  (Auto)     │    │  (Auto)     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

## Stage 1: Research (Manual - Perplexity Pro)
**Owner**: Human operator
**Tool**: Perplexity Pro
**Output**: Structured research brief (JSON)

### Research Brief Schema
```json
{
  "topic": "HDB BTO Application Guide 2025",
  "category": "HOUSING",
  "neighborhood": "Tampines",
  "targetKeywords": ["BTO application", "HDB eligibility", "Tampines BTO"],
  "sources": [
    "https://www.hdb.gov.sg/...",
    "https://www.hdb.gov.sg/..."
  ],
  "keyDataPoints": {
    "incomeCeiling": "$14,000",
    "grantAmounts": "Up to $80,000",
    "waitTime": "3-5 years"
  },
  "competitorGaps": [
    "No neighborhood-specific wait times",
    "Missing grant calculator"
  ]
}
```

---

## Stage 2: Cleaning (Automated)
**Tool**: Local script (Node.js)
**Input**: Research brief + raw source content
**Output**: Cleaned, structured data

### Operations
- Remove affiliate links, tracking params
- Normalize currency (SGD), dates (ISO 8601)
- Extract structured data: prices, dates, addresses, MRT stations
- Validate source URLs (must be official .gov.sg or verified partners)
- Flag unverifiable claims for human review

---

## Stage 3: Writing (AI - Hermes/Ollama 6B → OpenRouter)
**Models**: 
- Local: Hermes 3 (6B) via Ollama for draft
- Cloud: OpenRouter (free tier: Llama 3.1 70B, Qwen 2.5 72B) for refinement

### Prompt Template
```
Write a comprehensive Singapore Resident Guide for: {topic}

CATEGORY: {category}
NEIGHBORHOOD: {neighborhood}
TARGET KEYWORDS: {keywords}
KEY DATA: {keyDataPoints}

REQUIREMENTS:
1. HTML output only (h2, h3, p, ul, ol, strong, table)
2. Every paragraph starts with ✦
3. Include Insider Intelligence Box data (price, bestTime, secretTip)
4. Practical, resident-first tone - not tourist content
5. Singapore context: use SGD, MRT names, HDB/CPF terms
6. Affiliate placeholders: [KLOOK_LINK], [TRIP_LINK]
7. Word count: 1,500-2,500 words
8. JSON-LD ready structure

OUTPUT FORMAT:
{
  "title": "...",
  "slug": "...",
  "excerpt": "...",
  "content": "<h2>...</h2><p>✦...</p>...",
  "category": "{category}",
  "neighborhood": "{neighborhood}",
  "tags": [...],
  "insiderPrice": "...",
  "bestTime": "...",
  "secretTip": "...",
  "metaTitle": "...",
  "metaDescription": "..."
}
```

---

## Stage 4: SEO Optimization (AI)
**Model**: OpenRouter (specialized SEO model)
**Input**: Draft article + target keywords
**Output**: SEO-optimized article

### Optimizations
- Title: < 60 chars, keyword front-loaded
- Meta description: 150-160 chars, CTA included
- H2/H3 keyword distribution
- Internal link anchor text optimization
- Image alt text generation
- FAQ schema generation (from common questions)
- Article schema enhancement

---

## Stage 5: Internal Linking (Automated)
**Logic**: Priority-based algorithm

### Priority Order
1. **Same neighborhood + Same category** (highest)
2. **Same neighborhood** (different category)
3. **Same category** (different neighborhood)
3. **Newest published** (fallback)

### Implementation
```typescript
// In guide detail page (already implemented)
const sortedRelated = relatedPosts.sort((a, b) => {
  const aSameNeighborhood = a.neighborhood === post.neighborhood;
  const bSameNeighborhood = b.neighborhood === post.neighborhood;
  const aSameCategory = a.category === post.category;
  const bSameCategory = b.category === post.category;
  
  if (aSameNeighborhood && aSameCategory && !(bSameNeighborhood && bSameCategory)) return -1;
  if (bSameNeighborhood && bSameCategory && !(aSameNeighborhood && aSameCategory)) return 1;
  if (aSameNeighborhood && !bSameNeighborhood) return -1;
  if (bSameNeighborhood && !aSameNeighborhood) return 1;
  if (aSameCategory && !bSameCategory) return -1;
  if (bSameCategory && !aSameCategory) return 1;
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}).slice(0, 3);
```

### Cross-Page Linking
- Neighborhood hub pages → category-filtered guide lists
- Guide pages → neighborhood hub (if neighborhood assigned)
- Category tabs on /guides → filtered results
- Breadcrumb schema on every guide page

---

## Stage 6: Image Handling (Automated)
**Primary**: Unsplash (verified URLs only)
**Fallback**: Reliable public CDN URLs
**Policy**: NO generated/fake URLs. If unverifiable → leave empty.

### Image Selection Logic
1. Search Unsplash for: `{topic} Singapore {neighborhood}`
2. Verify URL returns 200 OK (HEAD request)
3. Check dimensions ≥ 1200px width
4. Store as `imageUrl` in Post model
5. If no verified image → `imageUrl: null` (UI shows gradient fallback)

### Image Schema
```json
{
  "imageUrl": "https://images.unsplash.com/photo-xxx?w=1600",
  "alt": "Descriptive alt text for accessibility",
  "width": 1600,
  "height": 900
}
```

---

## Stage 7: Publish (Automated)
**Action**: Database insert via Prisma
**Status**: `PUBLISHED` (no draft workflow)

### Post Creation
```typescript
await prisma.post.create({
  data: {
    title: optimized.title,
    slug: optimized.slug,
    excerpt: optimized.excerpt,
    content: optimized.content,
    imageUrl: optimized.imageUrl,
    category: optimized.category,      // PostCategory enum
    neighborhood: optimized.neighborhood,
    tags: optimized.tags,
    status: 'PUBLISHED',
    authorId: 'system_author_id',
    insiderPrice: optimized.insiderPrice,
    bestTime: optimized.bestTime,
    secretTip: optimized.secretTip,
    metaTitle: optimized.metaTitle,
    metaDescription: optimized.metaDescription,
    klookUrl: optimized.klookUrl,
    tripUrl: optimized.tripUrl,
  }
});
```

### Slug Generation
```typescript
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
// Ensure uniqueness: append -2, -3 if collision
```

---

## Stage 8: Revalidate (Automated)
**Trigger**: Post-publish webhook
**Targets**: 
- `/guides/[slug]` (new page)
- `/guides` (listing)
- `/guides?category=X` (category filter)
- `/neighborhoods/[slug]` (if neighborhood assigned)
- `/neighborhoods` (hub)
- `/latest` (timeline)
- `/sitemap.xml`

### Revalidation API
```typescript
// POST /api/revalidate
// Body: { paths: string[], secret: "REVALIDATE_SECRET" }

export async function POST(req: Request) {
  const { paths, secret } = await req.json();
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  for (const path of paths) {
    revalidatePath(path);
  }
  
  // Also revalidate dynamic routes
  revalidatePath('/guides/[slug]', 'page');
  revalidatePath('/neighborhoods/[slug]', 'page');
  
  return Response.json({ revalidated: true, paths, timestamp: new Date().toISOString() });
}
```

### Trigger from Pipeline
```bash
curl -X POST https://sgeventshub.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"paths": ["/guides/new-slug", "/guides", "/guides?category=HOUSING", "/neighborhoods/tampines", "/latest", "/sitemap.xml"], "secret": "REVALIDATE_SECRET"}'
```

---

## Database Schema (Prisma)

```prisma
enum PostCategory {
  HOUSING
  TRANSPORT
  MONEY
  STUDY
  HEALTHCARE
  FOOD
  WORK
  LIFESTYLE
  NEIGHBORHOOD
  TOOLS
  TRAVEL_GUIDE
}

enum PostStatus {
  PUBLISHED
  DRAFT
  ARCHIVED
}

model Post {
  id            Int         @id @default(autoincrement())
  slug          String      @unique
  title         String
  excerpt       String?     @db.Text
  content       String      @db.Text
  imageUrl      String?
  category      PostCategory @default(TRAVEL_GUIDE)
  neighborhood  String?
  tags          String[]    @default([])
  status        PostStatus  @default(PUBLISHED)
  authorId      String?
  author        Author?     @relation(fields: [authorId], references: [id])
  isNewsjack    Boolean?    @default(false)
  insiderPrice  String?     @db.Text
  bestTime      String?     @db.Text
  secretTip     String?     @db.Text
  tripUrl       String?     @db.Text
  klookUrl      String?     @db.Text
  metaTitle     String?
  metaDescription String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@index([slug])
  @@index([category])
  @@index([neighborhood])
  @@index([status])
  @@index([createdAt])
}
```

---

## Environment Variables Required

```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# AI Services
OLLAMA_HOST="http://localhost:11434"
OPENROUTER_API_KEY="sk-or-..."
PERPLEXITY_API_KEY="pplx-..."

# Affiliate
KLOOK_AID="105111"
TRIP_ALLIANCE_ID="7367361"
TRIP_SID="278066643"

# Revalidation
REVALIDATE_SECRET="your-secure-random-string"

# Analytics
GA_ID="G-XXXXXXXXXX"
VERCEL_ANALYTICS_ID="..."
```

---

## Monitoring & Observability

### Pipeline Metrics
- Articles published per day/week
- Average pipeline duration (research → live)
- Revalidation success rate
- Internal link coverage (% pages with ≥3 related links)
- Image verification success rate

### Alerts
- Pipeline failure (webhook retry 3x then alert)
- Revalidation failure
- Database insert failure
- Image verification failure rate > 20%

---

## Future Enhancements (Post-Sprint)

1. **Content Queue Dashboard** - Admin UI to review/edit before publish
2. **A/B Title Testing** - Auto-generate 3 titles, test CTR
3. **Content Freshness Score** - Auto-flag guides older than 6 months
4. **Competitor Monitoring** - Alert when competitors publish on tracked topics
5. **Multi-language** - Auto-translate to Chinese/Malay/Tamil
6. **Voice Generation** - TTS for audio versions
7. **Social Snippets** - Auto-generate Twitter/LinkedIn threads

---

## Security Considerations

- All AI prompts sanitized (no user input in prompts)
- Affiliate links validated (only Klook/Trip.com domains)
- Image URLs verified (HEAD request, allowlist domains)
- Revalidation endpoint protected by secret
- Database writes via Prisma (parameterized queries)
- No raw SQL in pipeline

---

## Rollback Procedure

If bad article published:
1. `prisma post update --where slug="bad-slug" --data status=ARCHIVED`
2. Trigger revalidation for affected paths
3. Check sitemap.xml updated (auto on next build)
4. Monitor 404s in analytics

---

## Implementation Checklist

- [x] Prisma schema with PostCategory enum
- [x] Neighborhood hub pages (/neighborhoods, /neighborhoods/[slug])
- [x] Guides listing with category filters (/guides?category=X)
- [x] Guide detail page with breadcrumb + organization schema
- [x] Automatic internal linking (neighborhood → category → newest)
- [x] Sitemap with new routes
- [x] Latest page (/latest)
- [x] Tools page (/tools)
- [x] Updated navigation (Header + Footer)
- [ ] Revalidation API endpoint
- [ ] Pipeline scripts (research → publish)
- [ ] Image verification script
- [ ] Monitoring dashboard
- [ ] Documentation complete