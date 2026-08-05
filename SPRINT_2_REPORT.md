# SG Events Hub v2 - Sprint 2 Report: Product Architecture Refactor (Resident-First)

**Date**: 2026-08-05  
**Duration**: One Morning  
**Status**: ✅ COMPLETE - Build Passing

---

## Executive Summary

Sprint 1 established the technical architecture (database, navigation, schemas). Sprint 2 fixes the **Product/IA problem**: the homepage was empty, content was hidden, and the site still felt like a tourism website. This sprint reorganizes the information architecture to immediately communicate "Singapore Resident Intelligence" with dense content discovery.

---

## 1. What Changed

### Homepage (`/`) — Complete Rewrite
**New Section Structure** (top to bottom):

| Section | Purpose | Content |
|---------|---------|---------|
| **Hero** | Identity | "Singapore Resident Intelligence" + dual CTA (Guides / Neighborhoods) |
| **Today's Singapore** | Freshness | 8 newest resident articles (1 featured + 7 cards) |
| **Neighborhoods** | Location | 5 neighborhood cards with live article counts |
| **Browse by Topic** | Category | 8 topic cards with live guide counts |
| **Featured Guides** | Quality | 4 high-value evergreen articles (with insider data) |
| **Tools & Calculators** | Utility | 8 planned tools (Coming Soon) with progress indicators |
| **Latest Updates** | News | 3 news/travel items only |
| **Newsletter CTA** | Retention | Email capture form |
| **Trust Banner** | Authority | Research-Driven / Resident-First / Partner Rates |

**Key Improvements**:
- **24+ article cards** on homepage (was ~8)
- **Live counts** from database for every section
- **Clear section purpose** — no orphan content
- **Resident-first copy** throughout ("Where You Live", "What You Need", "Planning Intelligence")
- **Dual hero CTA** — Guides AND Neighborhoods

### Tools Pages (`/tools/[slug]`) — New Dynamic Routes
- 8 tool detail pages with `generateStaticParams`
- Each shows: description, category, development progress, related tools
- "Coming Soon" transparent about status
- Links back to `/tools` hub

### Sitemap (`/sitemap.xml`) — Updated
- Added 8 tool routes
- All routes properly prioritized

---

## 2. Why It's Better

### For Residents (Users)
| Before | After |
|--------|-------|
| Empty hero + 8 cards + 3 news | 7 content sections, 24+ cards |
| "Singapore Travel Planning Guide" | "Singapore Resident Intelligence" |
| Content hidden in `/latest` | Content exposed on homepage |
| No neighborhood discovery | 5 neighborhoods with counts |
| No topic browsing | 8 topics with live counts |
| Tools page orphaned | Tools linked from homepage |

### For Google (SEO)
| Metric | Improvement |
|--------|-------------|
| Homepage internal links | ~8 → ~40+ |
| Crawl depth to articles | 2 clicks → 1 click |
| Topical authority signals | Weak → Strong (live counts per category) |
| Indexable entry points | Few → Many (neighborhoods, topics, tools) |
| Structured data | Preserved + enhanced |

### For Product (Business)
- **Clear page responsibilities**: Home=discovery, /latest=archive, /guides=category, /neighborhoods=location, /tools=utility
- **No orphan pages**: Every section links to its archive
- **Honest about status**: Tools marked "Coming Soon" with progress
- **Resident-first identity**: Copy, structure, and IA all aligned

---

## 3. Technical Implementation

### Files Modified
| File | Change |
|------|--------|
| `src/app/page.tsx` | **Major rewrite** — new homepage architecture |
| `src/app/tools/[slug]/page.tsx` | **New** — dynamic tool detail pages |
| `src/app/sitemap.ts` | **Moderate** — added tool routes |

### Database Queries (Homepage)
All queries run in parallel, ISR 3600s preserved:
1. `todaysSingapore` — 8 newest resident articles
2. `neighborhoodsWithCounts` — 5 neighborhoods × article count
3. `topicsWithCounts` — 8 categories × article count
4. `featuredGuides` — 4 articles with insider data
5. `latestUpdates` — 3 news/travel items

### Performance
- Build size: +8 static tool pages (negligible)
- First Load JS: unchanged (~115 kB)
- ISR revalidate: 3600s on all dynamic pages
- No client-side JS added

---

## 4. Remaining Technical Debt

| Issue | Severity | Location |
|-------|----------|----------|
| XSS via `dangerouslySetInnerHTML` | High | `guides/[slug]/page.tsx` |
| No auth on `/api/submit` | High | `api/submit/route.ts` |
| Hardcoded secret in Server Action | High | `actions/submitEventSimple.ts` |
| `as any` casts on enums | Medium | Multiple files |
| Destructive `db push` migration | Medium | Prisma schema |
| No canonical on filter pages | Low | `guides/page.tsx` |
| Category filter URLs in sitemap | Low | `sitemap.ts` |

---

## 5. Recommended Next Sprint (Sprint 3)

### Priority 1: Security & Data Integrity
1. Add DOMPurify to `guides/[slug]/page.tsx`
2. Move secrets to env vars, add auth middleware
3. Create proper Prisma migration mapping old categories

### Priority 2: Content Pipeline
1. Build autonomous publishing pipeline (per `PUBLISHING_PIPELINE.md`)
2. Implement revalidation webhook (`/api/revalidate`)
3. Add content sanitization/validation

### Priority 3: Product Polish
1. Build first real tool (HDB Affordability Calculator)
2. Add canonical tags to `/guides?category=X`
3. Implement search (`/search` page)
4. Add author pages (`/author/[slug]`)

### Priority 4: SEO Enhancement
1. Add FAQ schema to guide pages
2. Implement breadcrumb navigation component
3. Add `lastmod` from DB to sitemap (already done)
4. Monitor Core Web Vitals

---

## 6. Verification Checklist

| Check | Status |
|-------|--------|
| `npm run build` passes | ✅ |
| All 30 routes generate | ✅ |
| Homepage shows 7 sections | ✅ |
| Neighborhood cards show live counts | ✅ |
| Topic cards show live counts | ✅ |
| Tool detail pages render | ✅ |
| Sitemap includes tool routes | ✅ |
| ISR revalidate=3600 preserved | ✅ |
| No TypeScript errors | ✅ |
| Existing URLs unchanged | ✅ |
| SEO schemas preserved | ✅ |

---

## 7. Architecture Diagram (Post-Sprint 2)

```
┌─────────────────────────────────────────────────────────────┐
│                    SG EVENTS HUB v2                         │
│              Singapore Resident Intelligence                │
├─────────────────────────────────────────────────────────────┤
│  HOME (/) — Discovery Hub                                   │
│  ├─ Today's Singapore (8 newest)                            │
│  ├─ Neighborhoods (5 hubs) → /neighborhoods                 │
│  ├─ Browse by Topic (8 cats) → /guides?category=X           │
│  ├─ Featured Guides (4 evergreen)                           │
│  ├─ Tools (8 calculators) → /tools                          │
│  ├─ Latest Updates (3 news) → /latest                       │
│  └─ Newsletter CTA                                          │
├─────────────────────────────────────────────────────────────┤
│  CONTENT LAYER                                              │
│  /guides          → Category archive (filterable)           │
│  /guides/[slug]   → Article + schemas + internal links      │
│  /neighborhoods   → Location overview                       │
│  /neighborhoods/[slug] → Neighborhood hub + articles        │
│  /latest          → Chronological archive (monthly)         │
│  /tools           → Utility hub                             │
│  /tools/[slug]    → Tool detail (Coming Soon)               │
├─────────────────────────────────────────────────────────────┤
│  DATA LAYER (Prisma)                                        │
│  Post { category: Enum, neighborhood, tags[], status }     │
│  Indexes: slug, category, neighborhood, status, createdAt  │
├─────────────────────────────────────────────────────────────┤
│  SEO LAYER                                                  │
│  ISR (3600s) | Metadata | JSON-LD (Article, Breadcrumb,    │
│  Org) | Sitemap | Robots | OpenGraph | Canonical           │
├─────────────────────────────────────────────────────────────┤
│  INTERNAL LINKING                                           │
│  Priority: Neighborhood+Category → Neighborhood → Category │
│  → Newest (implemented in guide detail page)               │
└─────────────────────────────────────────────────────────────┘
```

---

**Sign-off**: Product architecture now matches Resident-First strategy. Homepage communicates value immediately. Ready for content population and pipeline implementation.