# DEEPSEEK HANDOFF DOCUMENT
## SG Events Hub v2 - Autonomous Publishing Pipeline

**Generated**: 2026-08-05  
**Purpose**: Minimum context for another AI to implement the autonomous publishing pipeline correctly  
**Scope**: Architecture audit only - NO code modifications

---

# 1. ARCHITECTURE SUMMARY

## Project Structure
```
sgeventshub-v2/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── api/revalidate/     # ISR revalidation endpoint
│   │   ├── guides/             # Guide pages
│   │   │   ├── page.tsx        # Listing with category/neighborhood filters
│   │   │   └── [slug]/page.tsx # Guide detail with SEO, schemas, internal linking
│   │   ├── neighborhoods/      # Neighborhood hub pages
│   │   │   ├── page.tsx        # All neighborhoods grid
│   │   │   └── [slug]/page.tsx # Neighborhood detail with articles
│   │   ├── latest/page.tsx     # Timeline of latest posts
│   │   ├── layout.tsx          # Root layout with header/footer/analytics
│   │   ├── page.tsx            # Homepage with sections
│   │   ├── sitemap.ts          # Dynamic sitemap generation
│   │   └── robots.ts           # Robots.txt
│   ├── components/             # React components
│   │   ├── AffiliateCTA.tsx    # Klook/Trip.com affiliate buttons
│   │   ├── SiteHeader.tsx      # Navigation
│   │   └── SiteFooter.tsx
│   ├── lib/
│   │   ├── prisma.ts           # Prisma singleton client
│   │   ├── content-utils.ts    # HTML content splitting utility
│   │   └── data-access/        # Data access layer
│   │       └── events.ts       # Event queries
├── prisma/
│   ├── schema.prisma           # Database schema (PostgreSQL)
│   └── seed.ts                 # Seed data
├── scripts/                    # Node.js automation scripts
│   ├── import-folder.js        # Batch import from content-queue/
│   ├── import-guides.js        # Import from new_guides.txt
│   ├── import-news.js          # Import from news_queue.txt
│   ├── autonomous-agent.js     # AI content generation (Perplexity)
│   ├── publish-one.js          # Draft → Published scheduler
│   └── update_internal_links.ts # Link migration
├── content-queue/              # JSON files for batch import (14 files)
└── public/                     # Static assets
```

## Routing (Next.js App Router)
| Route | Purpose | Revalidation |
|-------|---------|--------------|
| `/` | Homepage with sections | 3600s |
| `/guides` | All guides listing with filters | 3600s |
| `/guides?category=X` | Category-filtered guides | 3600s |
| `/guides?neighborhood=Y` | Neighborhood-filtered guides | 3600s |
| `/guides/[slug]` | Guide detail page | 3600s |
| `/neighborhoods` | All neighborhoods hub | 3600s |
| `/neighborhoods/[slug]` | Neighborhood detail + articles | 3600s |
| `/latest` | Timeline of latest posts | 3600s |
| `/tools/[slug]` | Calculator tools (placeholder) | - |
| `/api/revalidate?path=X&secret=BOSS2026` | ISR cache purge | On-demand |

## Prisma Models Involved

### Post (Resident Guides) - PRIMARY
```prisma
model Post {
  id            Int         @id @default(autoincrement())
  slug          String      @unique
  title         String
  excerpt       String?     @db.Text
  content       String      @db.Text        // HTML content
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

enum PostCategory {
  HOUSING, TRANSPORT, MONEY, STUDY, HEALTHCARE, FOOD,
  WORK, LIFESTYLE, NEIGHBORHOOD, TOOLS, TRAVEL_GUIDE
}

enum PostStatus { PUBLISHED, DRAFT, ARCHIVED }
```

### Author (EEAT)
```prisma
model Author {
  id          String   @id @default(cuid())
  name        String
  email       String?
  role        String
  bio         String?  @db.Text
  avatarUrl   String?
  socialLinks Json?
  posts       Post[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Event (Legacy - separate system)
```prisma
model Event { ... } // Not part of guides pipeline
```

## Publishing Flow (Current - Manual/Scripted)
```
1. Content Source
   ├── content-queue/*.json (14 pre-written guides)
   ├── scripts/new_guides.txt (raw text with delimiters)
   ├── scripts/news_queue.txt (newsjacking format)
   └── Perplexity AI (autonomous-agent.js)

2. Import Scripts (Node.js)
   ├── import-folder.js → reads content-queue/*.json → prisma.post.upsert()
   ├── import-guides.js → parses new_guides.txt → HTML conversion → prisma.post.upsert()
   └── import-news.js → parses news_queue.txt → prisma.post.upsert()

3. Database
   └── PostgreSQL via Prisma (Post model)

4. Render
   └── Next.js App Router: /guides/[slug]/page.tsx (SSR with revalidate=3600)

5. SEO (Built into render)
   ├── generateMetadata() → title, description, OG, article:section, article:tag
   ├── JSON-LD schemas: Article, BreadcrumbList, Organization
   ├── Internal linking: neighborhood → category → newest priority
   └── Affiliate CTA: Klook/Trip.com with tracking params

6. ISR (Incremental Static Regeneration)
   ├── revalidate = 3600 on all pages
   ├── /api/revalidate endpoint (GET with secret)
   └── Manual trigger: curl /api/revalidate?path=/guides/new-slug&secret=BOSS2026
```

## Current SEO Flow
1. **Metadata API**: `generateMetadata()` in each page fetches post from DB
2. **Structured Data**: Three `<script type="application/ld+json">` blocks per guide:
   - Article schema (headline, description, image, dates, author, publisher)
   - BreadcrumbList (Home → Guides → Category → Article)
   - Organization (SG Events Hub)
3. **Sitemap**: Dynamic generation in `sitemap.ts` includes:
   - Static pages, neighborhood hubs, tool pages, category filters, all published posts
4. **Robots**: Allows all, disallows /admin, /api, /submit, /api/revalidate
5. **Internal Links**: Auto-generated on guide detail page (3 related posts)

## Current Article Rendering Flow
```
/guides/[slug]/page.tsx
├── generateMetadata() → SEO metadata + schemas
├── generateStaticParams() → returns [] (dynamic only)
├── GuideDetailPage()
│   ├── prisma.post.findUnique({ where: { slug }, include: { author } })
│   ├── Related posts query (neighborhood + category priority sort)
│   ├── Hero: full-screen image + gradients + badges
│   ├── Sidebar: sticky TOC + quick facts
│   ├── Content: dangerouslySetInnerHTML post.content
│   ├── InsiderIntelligenceBox (price, bestTime, secretTip)
│   ├── AffiliateCTA component (Klook/Trip.com)
│   ├── AuthorBox
│   └── Related Guides grid (3 items, priority sorted)
```

---

# 2. EXACT FILES DEEPSEEK MUST READ

## Database
| File | Why Needed |
|------|------------|
| `prisma/schema.prisma` | Complete Post/Author/Event models, enums, indexes |
| `src/lib/prisma.ts` | Prisma singleton pattern for serverless |

## Publishing
| File | Why Needed |
|------|------------|
| `scripts/import-folder.js` | Batch import from content-queue/ JSON → Post upsert |
| `scripts/import-guides.js` | Text parsing → HTML conversion → Post upsert |
| `scripts/import-news.js` | Newsjacking import with tag extraction |
| `scripts/autonomous-agent.js` | AI content generation via Perplexity |
| `scripts/publish-one.js` | Draft → Published scheduler logic |
| `content-queue/1.json` | Example content queue structure (14 files exist) |

## Article Rendering
| File | Why Needed |
|------|------------|
| `src/app/guides/[slug]/page.tsx` | Complete guide detail page with all SEO, schemas, internal linking |
| `src/app/guides/page.tsx` | Listing page with category/neighborhood filters |
| `src/components/AffiliateCTA.tsx` | Affiliate link generation with tracking params |
| `src/lib/content-utils.ts` | HTML content splitting utility |

## SEO
| File | Why Needed |
|------|------------|
| `src/app/sitemap.ts` | Dynamic sitemap with all routes + post URLs |
| `src/app/robots.ts` | Robots.txt configuration |
| `src/app/guides/[slug]/page.tsx` (lines 15-52) | generateMetadata + JSON-LD schemas |
| `next.config.js` | Image domains, redirects (/attractions → /guides) |

## Utilities
| File | Why Needed |
|------|------------|
| `src/lib/prisma.ts` | Database client |
| `src/lib/content-utils.ts` | Content splitting |
| `src/lib/data-access/events.ts` | Event queries (reference) |
| `package.json` | Dependencies, scripts (grind:news, grind:money) |

## Existing Scripts
| File | Why Needed |
|------|------------|
| `scripts/update_internal_links.ts` | Link migration pattern (/events → /guides) |
| `scripts/import-folder.js` (lines 132-139) | Revalidation trigger pattern |
| `src/app/api/revalidate/route.ts` | ISR revalidation endpoint |

---

# 3. EXACT FILES DEEPSEEK SHOULD NOT READ

| File/Directory | Reason |
|----------------|--------|
| `app.bak/` | Backup directory, outdated |
| `lab-upload/` | Experimental lab upload, unrelated |
| `scripts/check-*.js` (30+ files) | Debug/audit scripts, one-off |
| `scripts/fix-*.js` (15+ files) | One-off data fixes |
| `scripts/find-*.js` (15+ files) | Search/debug scripts |
| `scripts/cleanup-*.js` | One-off cleanup |
| `scripts/deep-*.js` | Deep analysis scripts |
| `scripts/list-*.js` | Listing scripts |
| `scripts/verify-*.js` | Verification scripts |
| `scripts/restore-*.js` | Restoration scripts |
| `scripts/enrich-*.js` | Event enrichment (legacy) |
| `scripts/seed-*.js` | Seeding scripts |
| `scripts/sync-*.js` | Sync scripts |
| `scripts/debug-*.js` | Debug scripts |
| `scripts/read-*.js` | File reading scripts |
| `scripts/count-*.js` | Counting scripts |
| `scripts/create-*.js` | Creation scripts |
| `scripts/force-*.js` | Force scripts |
| `scripts/global-search-db.js` | Search script |
| `scripts/hard-clean-post.js` | One-off clean |
| `scripts/mass-sanitizer.js` | Sanitizer |
| `scripts/reborn.js` | Reborn script |
| `scripts/scrub-html.js` | HTML scrubber |
| `scripts/search-*.js` | Search scripts |
| `scripts/test-find.js` | Test script |
| `scripts/update-*.js` (except update_internal_links.ts) | One-off updates |
| `*.json` (root) | Build logs, audit outputs, temp files |
| `*.txt` (root) | Logs, debug outputs |
| `public/images/` | Static images |
| `components/Event*.tsx` | Event components (legacy) |
| `components/OneMapComponent.tsx` | Map component |
| `components/InteractiveMap*.tsx` | Map components |
| `components/SearchInput.tsx` | Search component |
| `components/SimpleLocationCard.tsx` | Location card |
| `components/TripBanner.tsx` | Trip banner |
| `components/CTAButton.tsx` | Button component |
| `components/CTAGroup.tsx` | CTA group |
| `components/IconsCarousel.tsx` | Carousel |
| `src/app/tools/` | Placeholder tools |
| `src/app/trending/` | Trending page |
| `src/app/about/`, `/contact/`, `/privacy-policy/` | Static pages |

---

# 4. EXISTING PUBLISHING FLOW (TRACE)

```
CONTENT SOURCE
     │
     ▼
┌─────────────────────────────────────┐
│  content-queue/*.json (14 files)    │  ← Pre-written guides with full data
│  scripts/new_guides.txt             │  ← Raw text with === delimiters
│  scripts/news_queue.txt             │  ← Newsjacking with [TAG] format
│  Perplexity AI (autonomous-agent)   │  ← AI-generated from prompts
└─────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  IMPORT SCRIPTS (Node.js)           │
│  • import-folder.js                 │  → Reads JSON, maps fields, upserts Post
│  • import-guides.js                 │  → Parses text, converts to HTML, upserts
│  • import-news.js                   │  → Extracts [TITLE][SLUG] tags, upserts
│  • autonomous-agent.js              │  → Calls Perplexity, validates Klook/Trip URLs
└─────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  DATABASE (PostgreSQL via Prisma)   │
│  Post {                             │
│    slug: unique,                    │
│    title, excerpt, content (HTML),  │
│    imageUrl, category (enum),       │
│    neighborhood, tags[],            │
│    status: PUBLISHED,               │
│    authorId, isNewsjack,            │
│    insiderPrice, bestTime, secretTip│
│    tripUrl, klookUrl,               │
│    metaTitle, metaDescription       │
│  }                                  │
└─────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  RENDER (Next.js App Router)        │
│  /guides/[slug]/page.tsx            │
│  • generateMetadata() → SEO + LD+JSON│
│  • GuideDetailPage()                │
│    - Fetch post + author            │
│    - Query related posts (priority) │
│    - Render hero, content, CTA,     │
│      author, related guides         │
│  • revalidate = 3600 (ISR)          │
└─────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  SEO (Built into render)            │
│  • Metadata: title, desc, OG        │
│  • JSON-LD: Article, Breadcrumb, Org│
│  • Internal links: 3 related posts  │
│  • Affiliate CTA with tracking      │
│  • Sitemap: dynamic generation      │
│  • Robots: allow all, disallow admin│
└─────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  ISR (Incremental Static Regen)     │
│  • revalidate = 3600 on all pages   │
│  • /api/revalidate?path=X&secret=...│
│  • Manual curl trigger after publish│
└─────────────────────────────────────┘
```

---

# 5. INTEGRATION POINTS

## Where New Modules Plug In

### `research_import` (Stage 1→2)
**Input**: Perplexity research brief (JSON) or raw source content  
**Output**: Cleaned, structured data ready for writing  
**Plug Point**: New script `scripts/research_import.js`  
**Integration**:
- Reads from `content-queue/research/` or stdin
- Outputs normalized JSON to `content-queue/cleaned/`
- Uses existing `slugify()` from import-guides.js
- Validates source URLs (must be .gov.sg or verified partners)
- **Must NOT modify**: Prisma schema, existing import scripts

### `write_article` (Stage 3)
**Input**: Cleaned research data + target keywords  
**Output**: SEO-optimized article JSON (title, slug, content, excerpt, meta, insider fields)  
**Plug Point**: New script `scripts/write_article.js`  
**Integration**:
- Uses OpenRouter/Ollama (env: OPENROUTER_API_KEY, OLLAMA_HOST)
- Follows prompt template from PUBLISHING_PIPELINE.md lines 71-105
- Output JSON matches Post model fields exactly
- HTML content: `<h2>`, `<p>✦...`, `<ul>`, `<strong>`, tables
- **Must NOT modify**: Guide detail page rendering, AffiliateCTA

### `publish_article` (Stage 7)
**Input**: Optimized article JSON  
**Output**: Published Post in database + revalidation triggered  
**Plug Point**: New script `scripts/publish_article.js`  
**Integration**:
- `prisma.post.upsert({ where: { slug }, create: data, update: data })`
- Slug uniqueness: append `-2`, `-3` on collision (see PUBLISHING_PIPELINE.md lines 214-225)
- Sets `status: 'PUBLISHED'`, `authorId: 'system_author_id'`
- Triggers revalidation via `fetch('/api/revalidate', { method: 'POST', body: JSON.stringify({ paths, secret }) })`
- **Must NOT modify**: Prisma schema, revalidation endpoint, sitemap generation

### `run_pipeline` (Orchestrator)
**Input**: Topic/category/neighborhood  
**Output**: Complete pipeline execution  
**Plug Point**: New script `scripts/run_pipeline.js`  
**Integration**:
- Chains: research_import → write_article → publish_article
- Handles retries, logging, error recovery
- Uses existing npm scripts pattern: `"pipeline": "node scripts/run_pipeline.js"`
- **Must NOT modify**: Existing npm scripts, package.json structure

---

# 6. RISKS - WHERE DEEPSEEK MUST BE CAREFUL

## Routing
- ❌ **DO NOT CHANGE** route structure: `/guides/[slug]`, `/guides?category=X`, `/neighborhoods/[slug]`
- ❌ **DO NOT REMOVE** `revalidate = 3600` from pages
- ❌ **DO NOT MODIFY** `next.config.js` redirects (/attractions → /guides, /events → /guides)
- ✅ Safe: Add new routes under `/api/pipeline/` for pipeline endpoints

## SEO
- ❌ **DO NOT REMOVE** `generateMetadata()` from guide detail page
- ❌ **DO NOT REMOVE** three JSON-LD schemas (Article, BreadcrumbList, Organization)
- ❌ **DO NOT CHANGE** meta field names: `metaTitle`, `metaDescription` in Post model
- ❌ **DO NOT BREAK** sitemap.ts - it queries `prisma.post.findMany({ where: { status: 'PUBLISHED' } })`
- ✅ Safe: Add new meta fields to Post model (requires migration)

## Metadata
- ❌ **DO NOT RENAME** Post fields: `slug`, `title`, `excerpt`, `content`, `category`, `neighborhood`, `tags`, `status`, `authorId`, `isNewsjack`, `insiderPrice`, `bestTime`, `secretTip`, `tripUrl`, `klookUrl`
- ❌ **DO NOT CHANGE** PostCategory enum values (HOUSING, TRANSPORT, etc.)
- ❌ **DO NOT CHANGE** PostStatus enum (PUBLISHED, DRAFT, ARCHIVED)
- ✅ Safe: Add new optional fields to Post model

## Sitemap
- ❌ **DO NOT BREAK** `sitemap.ts` - it expects Post model with `slug` and `updatedAt`
- ❌ **DO NOT REMOVE** static pages, neighborhood pages, tool pages, category pages from sitemap
- ✅ Safe: Add new route types to sitemap

## ISR (Incremental Static Regeneration)
- ❌ **DO NOT CHANGE** `revalidate = 3600` constant on pages
- ❌ **DO NOT BREAK** `/api/revalidate` endpoint (GET with secret=BOSS2026)
- ❌ **DO NOT REMOVE** `revalidatePath('/guides/[slug]', 'page')` call
- ✅ Safe: Add POST endpoint for batch revalidation (see PUBLISHING_PIPELINE.md lines 240-260)

## Internal Linking
- ❌ **DO NOT BREAK** priority algorithm in `/guides/[slug]/page.tsx` lines 273-304:
  1. Same neighborhood + same category
  2. Same neighborhood
  3. Same category
  4. Newest published
- ❌ **DO NOT REMOVE** related posts section from guide detail page
- ❌ **DO NOT CHANGE** neighborhood hub → category filter links (`/guides?category=X&neighborhood=Y`)
- ✅ Safe: Add cross-linking from new content types

## Category System
- ❌ **DO NOT RENAME** PostCategory enum values
- ❌ **DO NOT REMOVE** category filter tabs on `/guides` page
- ❌ **DO NOT CHANGE** category display labels in `guides/page.tsx` lines 13-25
- ❌ **DO NOT BREAK** category counts in sitemap and guide listing
- ✅ Safe: Add new categories to enum (requires migration)

---

# 7. FINAL DELIVERABLE

This document (`DEEPSEEK_HANDOFF.md`) + the required source files listed in Section 2 are the **complete context package**.

## Files to Upload for DeepSeek
```
DEEPSEEK_HANDOFF.md
prisma/schema.prisma
src/lib/prisma.ts
src/app/guides/[slug]/page.tsx
src/app/guides/page.tsx
src/app/neighborhoods/page.tsx
src/app/neighborhoods/[slug]/page.tsx
src/app/latest/page.tsx
src/app/sitemap.ts
src/app/robots.ts
src/app/api/revalidate/route.ts
src/components/AffiliateCTA.tsx
src/lib/content-utils.ts
scripts/import-folder.js
scripts/import-guides.js
scripts/import-news.js
scripts/autonomous-agent.js
scripts/publish-one.js
scripts/update_internal_links.ts
content-queue/1.json
content-queue/2.json
next.config.js
package.json
PUBLISHING_PIPELINE.md
```

## Implementation Checklist for DeepSeek
- [ ] Create `scripts/research_import.js` - Research brief → cleaned data
- [ ] Create `scripts/write_article.js` - Cleaned data → SEO article JSON
- [ ] Create `scripts/publish_article.js` - Article JSON → DB + revalidation
- [ ] Create `scripts/run_pipeline.js` - Orchestrator
- [ ] Add npm scripts to package.json
- [ ] Test end-to-end with one topic
- [ ] Verify sitemap updates, ISR works, internal links render

## Environment Variables Needed
```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
PERPLEXITY_API_KEY="pplx-..."
OPENROUTER_API_KEY="sk-or-..."
OLLAMA_HOST="http://localhost:11434"
KLOOK_AID="105111"
TRIP_ALLIANCE_ID="7367361"
TRIP_SID="278066643"
REVALIDATE_SECRET="your-secure-random-string"
```

---

**END OF HANDOFF DOCUMENT**