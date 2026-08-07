# SGEventsHub v2 - Content Publishing Pipeline Audit

**Audit Date:** August 6, 2026  
**Status:** Documentation Only - No Code Changes Made

---

## Executive Summary

SGEventsHub v2 uses a **hybrid publishing pipeline** combining manual content preparation (JSON files in `content-queue/`) with automated database publishing and Next.js ISR (Incremental Static Regeneration). The pipeline is **partially automated** - content creation is manual, but publishing, revalidation, and sitemap generation are automated.

---

## 1. How a New Article Moves from Content-Queue to Production

### Current Flow (Implemented)

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  CONTENT QUEUE  │────▶│  IMPORT SCRIPT   │────▶│   DATABASE      │────▶│  NEXT.JS ISR    │
│  (JSON files)   │     │  (import-folder) │     │  (PostgreSQL)   │     │  (Auto-render)  │
└─────────────────┘     └──────────────────┘     └─────────────────┘     └──────────────────┘
        │                       │                       │                       │
        ▼                       ▼                       ▼                       ▼
   Manual prep           Node.js script           Prisma ORM            React Server
   (14 JSON files)       (batch upsert)           (Post model)          Components
```

### Step-by-Step Process

| Step | Action | Tool/Script | Manual/Automatic |
|------|--------|-------------|------------------|
| 1 | Create JSON file in `content-queue/` | Manual (editor) | **Manual** |
| 2 | Run import script | `node scripts/import-folder.js` | **Manual trigger** |
| 3 | Script reads all JSON files | `import-folder.js` | Automatic |
| 4 | Upserts to PostgreSQL via Prisma | `prisma.post.upsert()` | Automatic |
| 5 | Next.js serves from DB | `prisma.post.findMany()` | Automatic (ISR) |
| 6 | Revalidation triggered | `publish_article.js` → API | **Manual trigger** |
| 7 | Sitemap regenerates | `sitemap.ts` (build-time) | **Build required** |

---

## 2. Which Scripts Are Used

### Primary Publishing Scripts

| Script | Purpose | Command |
|--------|---------|---------|
| `scripts/import-folder.js` | **Main batch importer** - reads all JSON from `content-queue/`, upserts to DB | `node scripts/import-folder.js` |
| `scripts/publish_article.js` | **Single article publisher** - publishes one article + triggers revalidation | `node scripts/publish_article.js <article.json>` |
| `scripts/publish-one.js` | Event publisher (different model) - publishes draft events | `node scripts/publish-one.js` |
| `scripts/autonomous-agent.js` | AI content generator - creates content via Perplexity API | `npm run grind:news` or `npm run grind:money` |

### Supporting Scripts

| Script | Purpose |
|--------|---------|
| `scripts/lib/image-provider.js` | Fetches images from Unsplash/Pexels/Pixabay |
| `scripts/enrichEvents.js` | Enriches event data |
| `scripts/import-news.js` | Imports news content |
| `scripts/import-guides.js` | Imports guide content |

### Package.json Commands

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "seed": "tsx prisma/seed.ts",
    "postinstall": "prisma generate",
    "enrich-events": "node scripts/enrichEvents.js",
    "enrich-events:retry": "node scripts/enrichEvents.js --retry",
    "grind:news": "node scripts/autonomous-agent.js trend",
    "grind:money": "node scripts/autonomous-agent.js money"
  }
}
```

---

## 3. Commands You Need to Run

### Standard Publishing Workflow

```bash
# 1. Prepare content (manual - create/edit JSON in content-queue/)
# Example: content-queue/15.json

# 2. Import all queued content to database
node scripts/import-folder.js

# 3. Trigger revalidation (optional - script attempts this)
# Or manually:
curl -X POST https://sgeventshub.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"paths": ["/guides/new-slug", "/guides", "/latest", "/sitemap.xml"], "secret": "YOUR_REVALIDATE_SECRET"}'

# 4. For production: rebuild to update sitemap.xml
npm run build && npm run start
```

### Alternative: Single Article Publish

```bash
# Publish one specific article with auto-revalidation
node scripts/publish_article.js content-queue/15.json
```

### AI Content Generation (Experimental)

```bash
# Generate trend-based content via Perplexity AI
npm run grind:news

# Generate money/finance content
npm run grind:money
```

---

## 4. What Happens Automatically

| Process | Automatic? | Details |
|---------|------------|---------|
| **Database insert/upsert** | ✅ Yes | `import-folder.js` uses `prisma.post.upsert()` |
| **Author creation** | ✅ Yes | `ensureAuthorsExist()` creates 3 authors |
| **Slug collision handling** | ✅ Yes | Appends `-2`, `-3` if slug exists |
| **Image fetching** | ✅ Yes | Falls back to Unsplash if no image provided |
| **Affiliate link injection** | ✅ Yes | Klook/Trip.com params added automatically |
| **Internal linking** | ✅ Yes | `sortedRelated` algorithm in guide detail page |
| **ISR page rendering** | ✅ Yes | `export const revalidate = 3600` (1 hour) |
| **Dynamic route params** | ✅ Yes | `generateStaticParams()` returns `[]` (dynamic) |
| **Metadata generation** | ✅ Yes | `generateMetadata()` fetches from DB |
| **JSON-LD schemas** | ✅ Yes | Article, Breadcrumb, Organization schemas |
| **Sitemap generation** | ⚠️ Build-time only | Runs at `npm run build`, not on publish |

---

## 5. What Still Requires Manual Work

| Task | Manual? | Why |
|------|---------|-----|
| **Content creation** | ✅ Yes | JSON files written by hand or AI-assisted |
| **Content review/approval** | ✅ Yes | No admin UI for review before publish |
| **Running import script** | ✅ Yes | No cron job or webhook trigger |
| **Triggering revalidation** | ⚠️ Partial | Script attempts but may fail; manual curl often needed |
| **Sitemap update** | ✅ Yes | Requires `npm run build` (not automatic) |
| **Image selection** | ⚠️ Partial | Auto-fetches but no curation/approval |
| **Category assignment** | ✅ Yes | Hardcoded to "Evergreen" in import script |
| **Neighborhood assignment** | ✅ Yes | Not extracted from content |
| **Tag management** | ✅ Yes | Empty array by default |
| **SEO meta fields** | ⚠️ Partial | Uses excerpt/title but no dedicated SEO review |

---

## 6. Does Sitemap Update Automatically?

**NO - Not automatically on publish.**

### Current Behavior:
- `src/app/sitemap.ts` runs **only at build time** (`npm run build`)
- Fetches all `PUBLISHED` posts from database
- Generates static `sitemap.xml` in output directory
- **New articles won't appear in sitemap until next build**

### To Update Sitemap:
```bash
npm run build  # Regenerates sitemap.xml with latest posts
npm run start  # Serves updated sitemap
```

### Workaround (Manual):
The `import-folder.js` script prints a tip:
```
Tip: Access /api/revalidate?path=/&secret=BOSS2026 to clear cache immediately.
```
But this only clears ISR cache, **not** the sitemap.

---

## 7. Does ISR Automatically Rebuild Pages?

**YES - But with caveats.**

### Configuration:
```typescript
// In guide detail page and listing pages
export const revalidate = 3600; // 1 hour
```

### How It Works:
1. **First request** → Page rendered and cached
2. **Subsequent requests (within 1 hour)** → Served from cache
3. **After 1 hour** → Next request triggers background re-render
4. **Stale-while-revalidate** → Old page served while new one builds

### What Triggers Rebuild:
- ✅ Time expiry (1 hour)
- ✅ Manual `revalidatePath()` via API
- ❌ Database change alone (no webhook)
- ❌ New article publish (unless revalidation API called)

### Pages Using ISR:
| Page | Revalidate | Dynamic Params |
|------|------------|----------------|
| `/guides` | 3600s | N/A |
| `/guides/[slug]` | 3600s | `generateStaticParams() = []` |
| `/guides?category=X` | 3600s | N/A |
| `/latest` | 3600s | N/A |
| `/neighborhoods/[slug]` | 3600s | Pre-generated (5 neighborhoods) |
| `/tools/[slug]` | 3600s | Pre-generated (8 tools) |

---

## 8. Is Revalidate Automatic or Manual?

**HYBRID - Script attempts automatic, but manual often needed.**

### Automatic Attempt (in `publish_article.js`):
```javascript
async function triggerRevalidation(post) {
  const paths = [
    `/guides/${post.slug}`,
    '/guides',
    `/guides?category=${post.category}`,
    '/latest',
    '/sitemap.xml',  // Note: This won't actually update sitemap!
  ];
  if (post.neighborhood) {
    paths.push(`/neighborhoods/${hoodSlug}`);
    paths.push('/neighborhoods');
  }
  await fetch(`${base}/api/revalidate`, { method: 'POST', body: JSON.stringify({ paths, secret }) });
}
```

### Manual Trigger (Reliable):
```bash
curl -X POST https://sgeventshub.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"paths": ["/guides/new-slug", "/guides", "/latest"], "secret": "YOUR_SECRET"}'
```

### API Endpoint: `src/app/api/revalidate/route.ts`
- Accepts GET (single path) or POST (multiple paths)
- Validates `REVALIDATE_SECRET` env variable
- Calls `revalidatePath()` for each path
- Also revalidates dynamic routes: `/guides/[slug]`, `/neighborhoods/[slug]`

### ⚠️ Common Failure Points:
1. `REVALIDATE_SECRET` not set in production
2. Network timeout to self
3. `SITE_URL` env variable incorrect
4. Sitemap path included but doesn't actually regenerate sitemap

---

## 9. Do New Articles Become Immediately Indexable?

**NO - Not immediately.**

### Timeline to Indexability:

| Stage | Time | Indexable? |
|-------|------|------------|
| Article published to DB | Immediate | ❌ No (not in sitemap) |
| ISR cache expires / revalidated | Up to 1 hour (or manual) | ✅ Page renders |
| Sitemap updated | Next `npm run build` | ✅ Discoverable by crawlers |
| Google crawls sitemap | Hours to days | ✅ Indexed |
| Page appears in search | Days to weeks | ✅ Ranked |

### Critical Gaps:
1. **No automatic ping to search engines** (no IndexNow, no Google ping)
2. **Sitemap not updated on publish** (requires build)
3. **No robots.txt dynamic update** (static file)
4. **No webhook to Google Search Console / Bing**

### To Accelerate Indexing:
```bash
# 1. Revalidate page cache
curl -X POST https://sgeventshub.com/api/revalidate \
  -d '{"paths": ["/guides/new-slug"], "secret": "SECRET"}'

# 2. Rebuild for sitemap (production)
npm run build && npm run start

# 3. Manual submit to Google Search Console
# URL Inspection → Request Indexing
```

---

## 10. Possible Bottlenecks

### Technical Bottlenecks

| Bottleneck | Impact | Severity |
|------------|--------|----------|
| **No automated build pipeline** | Sitemap stale, manual deploy needed | 🔴 High |
| **Single-threaded import** | Slow for large batches | 🟡 Medium |
| **No content validation** | Bad data enters DB | 🟡 Medium |
| **Image verification sequential** | Slow import if many images | 🟡 Medium |
| **No rollback mechanism** | Bad publish = manual DB fix | 🟡 Medium |
| **Revalidation can fail silently** | Stale content served | 🟡 Medium |
| **No publishing queue/status** | Can't track what's pending | 🟡 Medium |

### Operational Bottlenecks

| Bottleneck | Impact | Severity |
|------------|--------|----------|
| **Manual JSON creation** | Slow, error-prone | 🔴 High |
| **No preview/staging** | Can't review before live | 🔴 High |
| **No content calendar** | No scheduling | 🟡 Medium |
| **No multi-author workflow** | Single editor bottleneck | 🟡 Medium |
| **No analytics on pipeline** | Can't measure velocity | 🟢 Low |

### Scalability Concerns

| Concern | Current Limit | Risk |
|---------|---------------|------|
| `content-queue/` file count | ~14 files | Manual management breaks at 100+ |
| ISR cache (1 hour) | 3600s | Stale content during high-frequency publishing |
| `generateStaticParams = []` | All dynamic | No static pre-rendering benefit |
| Single DB connection | Prisma pool | Connection exhaustion at scale |

---

## Beginner-Friendly Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SGEventsHub v2 - PUBLISHING WORKFLOW                     │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │   CONTENT    │  ◄─── Human writes/edits JSON files
    │   QUEUE      │       (content-queue/1.json, 2.json, ...)
    │  (Manual)    │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │  IMPORT      │  ◄─── Run: node scripts/import-folder.js
    │  SCRIPT      │       • Reads ALL .json files
    │  (Manual     │       • Upserts to PostgreSQL via Prisma
    │   Trigger)   │       • Auto-generates slugs, fetches images
    └──────┬───────┘       • Injects affiliate links
           │
           ▼
    ┌──────────────┐
    │  DATABASE    │  ◄─── PostgreSQL (Post model)
    │  (PostgreSQL)│       • status: 'PUBLISHED'
    │              │       • category: 'Evergreen' (hardcoded)
    └──────┬───────┘       • author: 'Desmond Ho' (hardcoded)
           │
           ▼
    ┌──────────────┐
    │  REVALIDATE  │  ◄─── Automatic attempt by script
    │  (Hybrid)    │       OR Manual: curl /api/revalidate
    │              │       • Clears ISR cache for:
    └──────┬───────┘         - /guides/[slug]
           │                  - /guides
           │                  - /guides?category=X
           │                  - /latest
           │                  - /neighborhoods/[slug] (if applicable)
           ▼
    ┌──────────────┐
    │  NEXT.JS     │  ◄─── ISR (Incremental Static Regeneration)
    │  RENDERING   │       • revalidate = 3600 (1 hour)
    │  (Auto)      │       • Dynamic routes: generateStaticParams = []
    └──────┬───────┘       • Server Components fetch from DB
           │
           ▼
    ┌──────────────┐
    │  LIVE SITE   │  ◄─── Visitors see updated content
    │  (Auto)      │       • Internal links auto-generated
    │              │       • JSON-LD schemas included
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │  SITEMAP     │  ◄─── ⚠️ ONLY at build time!
    │  (Manual)    │       Run: npm run build
    │              │       Then: npm run start
    └──────────────┘


═══════════════════════════════════════════════════════════════════════════════
                              KEY COMMANDS CHEAT SHEET
═══════════════════════════════════════════════════════════════════════════════

# Standard workflow (after adding JSON to content-queue/)
node scripts/import-folder.js                    # 1. Publish to DB
curl -X POST https://sgeventshub.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"paths":["/guides/new-slug","/guides","/latest"],"secret":"SECRET"}'  # 2. Clear cache
npm run build && npm run start                   # 3. Update sitemap (production)

# Single article (with auto-revalidation attempt)
node scripts/publish_article.js content-queue/15.json

# AI content generation (experimental)
npm run grind:news      # Trend-based content
npm run grind:money     # Finance content

# Development
npm run dev             # Local dev server (localhost:3000)
npm run build           # Production build (updates sitemap.xml)
npm run start           # Production server


═══════════════════════════════════════════════════════════════════════════════
                              AUTOMATION GAPS SUMMARY
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────┐
│  ✅ FULLY AUTOMATED                                                          │
│  • Database upsert (Prisma)                                                 │
│  • Slug collision handling                                                  │
│  • Image fallback (Unsplash/Pexels/Pixabay)                                 │
│  • Affiliate link injection                                                 │
│  • Internal linking (related guides algorithm)                              │
│  • ISR page rendering (1-hour cache)                                        │
│  • JSON-LD schemas (Article, Breadcrumb, Organization)                      │
│  • Dynamic metadata generation                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  ⚠️ PARTIALLY AUTOMATED (NEEDS MANUAL TRIGGER)                              │
│  • Revalidation (script tries, but often fails → manual curl needed)        │
│  • Image selection (auto-fetches, no human curation)                        │
│  • SEO fields (uses excerpt/title, no dedicated optimization)               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  ❌ FULLY MANUAL                                                             │
│  • Content creation (JSON files)                                            │
│  • Content review/approval (no admin UI)                                    │
│  • Running import script (no cron/webhook)                                  │
│  • Sitemap update (requires npm run build)                                  │
│  • Category assignment (hardcoded to 'Evergreen')                           │
│  • Neighborhood assignment (not extracted)                                  │
│  • Tag management (empty by default)                                        │
│  • Search engine ping (no IndexNow/Google ping)                             │
│  • Production deploy (manual build + start)                                 │
└─────────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                              RECOMMENDED IMPROVEMENTS
═══════════════════════════════════════════════════════════════════════════════

Priority 1 (Critical):
1. Add CI/CD pipeline: Auto-build on git push → updates sitemap automatically
2. Add webhook/db trigger: Auto-revalidate on Post insert/update
3. Add IndexNow/Google ping: Notify search engines on publish

Priority 2 (High):
4. Build admin UI: Review queue, preview, schedule, approve
5. Add content validation: Schema validation before DB insert
6. Fix category/neighborhood extraction: Parse from content, not hardcode

Priority 3 (Medium):
7. Add publishing dashboard: Status, logs, metrics
8. Implement content calendar: Schedule future publishes
9. Add rollback: One-click archive + revalidate

Priority 4 (Nice to Have):
10. Multi-author workflow: Assign, review, approve
11. A/B title testing: Auto-generate variants
12. Content freshness monitoring: Alert on stale guides