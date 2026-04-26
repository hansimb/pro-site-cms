# Pro Site CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personal professional website CMS that is fully free to host on Vercel, easy to edit in the browser without opening a code editor, and reusable enough to serve as a clean base for future pro websites with modest extra work.

**Architecture:** Use one Next.js application for both the public site and the admin. Keep structured site content in Git-backed files, use a block-based home page model, keep writing content in Markdown with references, store case studies as structured records without dedicated detail pages, and publish changes through GitHub-backed saves that trigger Vercel deploys.

**Tech Stack:** Next.js App Router, TypeScript, React, Vercel, GitHub, JSON content files, Markdown articles with frontmatter, dark-mode-only design system, simple single-admin authentication

---

## Product Definition

`pro-site-cms` is a personal publishing and presentation system for one owner-admin. The first target is your own professional site, but the architecture should stay generic enough that the same system can later power other high-quality personal or professional websites without becoming a heavy multi-tenant CMS.

The site has three primary content domains:

1. `Home`
One block-based page that combines CV, about, positioning, links, featured work, featured writing, and contact.

2. `Case Studies`
A portfolio-style collection that stays hidden until at least one case exists. Each case uses the same compact structure: `background`, `problem`, `solution`, `process`, `results`, `links`.

3. `Writing`
A topic-driven publishing area. V1 starts with at least `Business & Economics` and `Tech`, but topics only appear when content exists. Articles are Markdown-based and support analytical, source-driven writing with explicit references.

---

## Product Scope

### In Scope for v1

- Dark-mode-only professional personal website
- Minimalist but modern editorial-style UI
- One admin for browser-based editing
- Block-based home page editor
- Structured case studies without dedicated case detail pages
- Topic grid for writing
- Markdown article authoring
- Reference or citation section in articles
- Conditional visibility for portfolio and writing areas
- Admin-controlled single accent color
- GitHub-backed content storage
- Free Vercel deployment

### Out of Scope for v1

- Multi-user admin roles
- Visitor accounts, comments, or community features
- Full drag-and-drop page builder
- WYSIWYG rich text article editor
- Dedicated case study detail pages
- Theme editing beyond accent color
- Multi-site tenant management
- Advanced workflow states beyond simple draft/published if not needed

---

## Architecture Decisions

### 1. Content storage

Use repository-backed content files instead of a hosted database.

Why:
- stays free without inactivity deletion risk
- content is versioned automatically
- easy rollback through git history
- simple fit for low-frequency publishing

### 2. Editing model

Use structured browser forms in `/admin`, not code editing and not a full visual builder.

Why:
- keeps v1 implementable
- preserves flexibility for your home page through ordered blocks
- avoids the complexity of a freeform page builder

### 3. Content model

Split content into three storage styles:
- JSON for site settings, navigation, home blocks, and case studies
- Markdown with frontmatter for articles
- optional local media assets for lightweight images

Why:
- JSON works well for structured editable forms
- Markdown is ideal for analytical writing and references
- mixed storage keeps each content type simple

### 4. Conditional visibility

Hide sections until content exists.

Rules:
- hide `Case Studies` nav and homepage previews until at least one published case exists
- hide `Writing` nav and homepage previews until at least one published article exists
- hide topic cards until that topic has at least one published article

### 5. Authentication

Start with a single-owner admin model.

Recommended v1:
- protected `/admin`
- one password-based login stored in env
- optional later upgrade to GitHub OAuth if needed

### 6. Design direction

The site is dark-mode-only with one configurable accent color.

Principles:
- modern and minimalist
- strong typography and spacing
- calm editorial feel
- no light mode support in v1
- no theme builder beyond accent color

---

## File Structure

### App routes

- Create: `app/(site)/page.tsx`
- Create: `app/(site)/writing/page.tsx`
- Create: `app/(site)/writing/[topic]/page.tsx`
- Create: `app/(site)/writing/[topic]/[slug]/page.tsx`
- Create: `app/admin/page.tsx`
- Create: `app/admin/layout.tsx`
- Create: `app/admin/home/page.tsx`
- Create: `app/admin/case-studies/page.tsx`
- Create: `app/admin/writing/page.tsx`
- Create: `app/admin/settings/page.tsx`
- Create: `app/layout.tsx`
- Create: `app/globals.css`

### Admin APIs

- Create: `app/api/admin/home/route.ts`
- Create: `app/api/admin/case-studies/route.ts`
- Create: `app/api/admin/writing/route.ts`
- Create: `app/api/admin/settings/route.ts`
- Create: `app/api/admin/media/route.ts`

### Content files

- Create: `content/home/home.json`
- Create: `content/case-studies/index.json`
- Create: `content/writing/topics.json`
- Create: `content/writing/business-economics/.gitkeep`
- Create: `content/writing/tech/.gitkeep`
- Create: `content/settings/site.json`
- Create: `content/settings/navigation.json`

### Content system

- Create: `lib/content/schema.ts`
- Create: `lib/content/loaders.ts`
- Create: `lib/content/writers.ts`
- Create: `lib/content/visibility.ts`
- Create: `lib/content/defaults.ts`
- Create: `lib/content/article-frontmatter.ts`

### GitHub and environment integration

- Create: `lib/github/client.ts`
- Create: `lib/github/commits.ts`
- Create: `lib/env.ts`
- Create: `.env.example`

### UI and rendering

- Create: `features/site/sections/hero-section.tsx`
- Create: `features/site/sections/rich-text-section.tsx`
- Create: `features/site/sections/quote-section.tsx`
- Create: `features/site/sections/links-section.tsx`
- Create: `features/site/sections/featured-articles-section.tsx`
- Create: `features/site/sections/featured-case-studies-section.tsx`
- Create: `features/site/sections/timeline-section.tsx`
- Create: `features/site/sections/contact-cta-section.tsx`
- Create: `features/site/sections/image-section.tsx`
- Create: `features/site/sections/text-box-section.tsx`
- Create: `features/site/writing/topic-grid.tsx`
- Create: `features/site/writing/article-view.tsx`
- Create: `features/site/case-studies/case-grid.tsx`

### Admin components

- Create: `features/admin/auth/login-form.tsx`
- Create: `features/admin/home/block-editor.tsx`
- Create: `features/admin/home/block-list.tsx`
- Create: `features/admin/home/block-form-switch.tsx`
- Create: `features/admin/case-studies/case-study-form.tsx`
- Create: `features/admin/case-studies/case-study-list.tsx`
- Create: `features/admin/writing/article-list.tsx`
- Create: `features/admin/writing/article-editor.tsx`
- Create: `features/admin/writing/topic-manager.tsx`
- Create: `features/admin/settings/site-settings-form.tsx`
- Create: `features/admin/media/media-library.tsx`

### Tests and docs

- Create: `tests/content-schema.test.ts`
- Create: `tests/content-loader.test.ts`
- Create: `tests/visibility-rules.test.ts`
- Create: `tests/article-frontmatter.test.ts`
- Create: `tests/admin-api.test.ts`
- Create: `README.md`

---

## Core Data Shapes

### Home page document

Home is an ordered array of blocks. Supported v1 block types:

- `hero`
- `richText`
- `quote`
- `links`
- `featuredArticles`
- `featuredCaseStudies`
- `timeline`
- `contactCta`
- `image`
- `textBox`

Each block should have:
- stable `id`
- `type`
- `visible`
- block-specific fields

### Case study record

Each case study should include:

- `id`
- `title`
- `summary`
- `background`
- `problem`
- `solution`
- `process`
- `results`
- `links`
- `tags`
- `published`
- optional `featured`

### Writing topic

Each topic should include:

- `slug`
- `title`
- `description`
- `published`

### Article frontmatter

Each Markdown article should include:

- `title`
- `slug`
- `topic`
- `excerpt`
- `publishedAt`
- `updatedAt`
- `published`
- `featured`
- `references`

`references` should support an ordered list of source items with label and URL, so articles can present a clear source-driven structure without needing a heavy citation engine.

---

## Task 1: Scaffold the base app and tooling

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `app/(site)/page.tsx`
- Create: `README.md`

- [ ] **Step 1: Initialize a Next.js App Router project with TypeScript**

Run: `npx create-next-app@latest . --ts --app --eslint --use-npm`
Expected: base project files created in the repo root

- [ ] **Step 2: Replace boilerplate with a minimal dark-mode-only shell**

Target result:

```tsx
export default function HomePage() {
  return <main className="site-shell"><h1>Pro Site CMS</h1></main>;
}
```

- [ ] **Step 3: Add a README that describes the product direction**

```md
# Pro Site CMS

Git-backed personal website CMS for a dark, modern, professional site on Vercel.
```

- [ ] **Step 4: Run the app locally**

Run: `npm run dev`
Expected: the home page renders without boilerplate styling

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore: scaffold pro-site-cms app"
```

---

## Task 2: Define schemas and default content

**Files:**
- Create: `content/home/home.json`
- Create: `content/case-studies/index.json`
- Create: `content/writing/topics.json`
- Create: `content/settings/site.json`
- Create: `content/settings/navigation.json`
- Create: `lib/content/schema.ts`
- Create: `lib/content/defaults.ts`
- Test: `tests/content-schema.test.ts`

- [ ] **Step 1: Write the failing schema tests for home blocks, case studies, and article metadata**

Test coverage should prove:
- a valid `hero` block passes
- a valid case study record passes
- an article frontmatter object with `references` passes

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/content-schema.test.ts`
Expected: FAIL because schemas do not exist yet

- [ ] **Step 3: Implement content schemas and starter defaults**

Include:
- home block union
- case study schema
- topic schema
- article frontmatter schema
- site settings schema with accent color
- navigation schema with conditional items

- [ ] **Step 4: Add starter content files**

Starter content should include:
- a minimal home document with a few default blocks
- empty case study list
- two starter topics: `business-economics` and `tech`
- site settings with a default accent color

- [ ] **Step 5: Re-run schema tests**

Run: `npm test -- tests/content-schema.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add content lib/content tests/content-schema.test.ts
git commit -m "feat: add content schemas and defaults"
```

---

## Task 3: Build content loaders and visibility rules

**Files:**
- Create: `lib/content/loaders.ts`
- Create: `lib/content/visibility.ts`
- Test: `tests/content-loader.test.ts`
- Test: `tests/visibility-rules.test.ts`

- [ ] **Step 1: Write the failing loader and visibility tests**

Test coverage should prove:
- home content loads from `content/home/home.json`
- published case study count controls portfolio visibility
- published article count controls writing visibility
- topic cards only include topics with published articles

- [ ] **Step 2: Run tests to verify they fail**

Run:
- `npm test -- tests/content-loader.test.ts`
- `npm test -- tests/visibility-rules.test.ts`

Expected: FAIL because loaders and visibility helpers are missing

- [ ] **Step 3: Implement file-based loaders**

Requirements:
- load JSON content files
- load Markdown article metadata per topic
- validate loaded data with schemas
- sort published writing content predictably

- [ ] **Step 4: Implement visibility helpers**

Helpers should answer:
- should show case studies?
- should show writing?
- which topics should appear in the writing grid?
- which featured sections can render safely?

- [ ] **Step 5: Re-run tests**

Run:
- `npm test -- tests/content-loader.test.ts`
- `npm test -- tests/visibility-rules.test.ts`

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add lib/content tests/content-loader.test.ts tests/visibility-rules.test.ts
git commit -m "feat: add content loaders and visibility rules"
```

---

## Task 4: Render the public site structure

**Files:**
- Modify: `app/(site)/page.tsx`
- Create: `app/(site)/writing/page.tsx`
- Create: `app/(site)/writing/[topic]/page.tsx`
- Create: `app/(site)/writing/[topic]/[slug]/page.tsx`
- Create: `features/site/sections/*`
- Create: `features/site/writing/topic-grid.tsx`
- Create: `features/site/writing/article-view.tsx`
- Create: `features/site/case-studies/case-grid.tsx`

- [ ] **Step 1: Create a shared block renderer for the home page**

Supported blocks:
- `hero`
- `richText`
- `quote`
- `links`
- `featuredArticles`
- `featuredCaseStudies`
- `timeline`
- `contactCta`
- `image`
- `textBox`

- [ ] **Step 2: Build the writing index and topic pages**

Requirements:
- writing index shows only visible topics
- topic page lists published articles for that topic
- article route renders Markdown content and references

- [ ] **Step 3: Build the case study grid**

Requirements:
- no dedicated case pages
- each card shows the standardized content structure compactly
- external links point to GitHub, LinkedIn, or other references

- [ ] **Step 4: Apply the dark editorial design system**

Requirements:
- dark-mode-only styling
- one CSS variable for accent color
- minimalist spacing and strong typography

- [ ] **Step 5: Verify manually**

Run: `npm run dev`
Expected:
- home renders from blocks
- writing routes work
- case study section stays hidden when empty

- [ ] **Step 6: Commit**

```bash
git add app features app/globals.css
git commit -m "feat: render public site structure"
```

---

## Task 5: Build the admin shell and authentication

**Files:**
- Create: `app/admin/layout.tsx`
- Create: `app/admin/page.tsx`
- Create: `features/admin/auth/login-form.tsx`
- Create: `lib/env.ts`

- [ ] **Step 1: Add a simple owner-admin login flow**

Recommended v1:
- password in env
- cookie or session gate for `/admin`
- redirect unauthenticated requests to login

- [ ] **Step 2: Build the admin landing page**

Admin areas:
- home
- case studies
- writing
- settings

- [ ] **Step 3: Add a UI shell that fits the site aesthetic**

Requirements:
- dark UI
- compact sidebar or nav
- clear save status surfaces

- [ ] **Step 4: Verify manually**

Run: `npm run dev`
Expected: `/admin` requires login and then shows the admin shell

- [ ] **Step 5: Commit**

```bash
git add app/admin features/admin lib/env.ts
git commit -m "feat: add admin shell and auth"
```

---

## Task 6: Build the home block editor

**Files:**
- Create: `app/admin/home/page.tsx`
- Create: `features/admin/home/block-editor.tsx`
- Create: `features/admin/home/block-list.tsx`
- Create: `features/admin/home/block-form-switch.tsx`
- Create: `app/api/admin/home/route.ts`
- Create: `lib/content/writers.ts`
- Test: `tests/admin-api.test.ts`

- [ ] **Step 1: Write a failing admin API test for invalid home block payloads**

Test coverage should prove:
- invalid block type is rejected
- missing required block fields are rejected

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/admin-api.test.ts`
Expected: FAIL because the home save route does not exist yet

- [ ] **Step 3: Build the ordered home block editor**

Required actions:
- add block
- remove block
- toggle visibility
- reorder blocks
- edit block fields

- [ ] **Step 4: Implement the validated save route**

Requirements:
- accept authenticated POST requests
- validate the full home document
- serialize JSON consistently

- [ ] **Step 5: Re-run tests and verify manually**

Run:
- `npm test -- tests/admin-api.test.ts`
- `npm run dev`

Expected:
- tests pass
- home blocks can be edited from `/admin/home`

- [ ] **Step 6: Commit**

```bash
git add app/admin/home app/api/admin/home features/admin/home lib/content tests/admin-api.test.ts
git commit -m "feat: add home block editor"
```

---

## Task 7: Build the case study admin flow

**Files:**
- Create: `app/admin/case-studies/page.tsx`
- Create: `features/admin/case-studies/case-study-form.tsx`
- Create: `features/admin/case-studies/case-study-list.tsx`
- Create: `app/api/admin/case-studies/route.ts`

- [ ] **Step 1: Build the case study list and form**

Required fields:
- title
- summary
- background
- problem
- solution
- process
- results
- links
- tags
- published
- featured

- [ ] **Step 2: Enforce the standardized structure in the form**

Goal:
- every case is filled systematically
- no freeform incomplete case card structure

- [ ] **Step 3: Add a validated save route for case study records**

Requirements:
- authenticated save
- stable ordering
- predictable IDs

- [ ] **Step 4: Verify conditional visibility manually**

Run: `npm run dev`
Expected:
- case studies remain hidden publicly when none are published
- first published case makes the section appear

- [ ] **Step 5: Commit**

```bash
git add app/admin/case-studies app/api/admin/case-studies features/admin/case-studies
git commit -m "feat: add case study management"
```

---

## Task 8: Build the writing admin and Markdown pipeline

**Files:**
- Create: `app/admin/writing/page.tsx`
- Create: `features/admin/writing/article-list.tsx`
- Create: `features/admin/writing/article-editor.tsx`
- Create: `features/admin/writing/topic-manager.tsx`
- Create: `app/api/admin/writing/route.ts`
- Create: `lib/content/article-frontmatter.ts`
- Test: `tests/article-frontmatter.test.ts`

- [ ] **Step 1: Write the failing frontmatter test**

Test coverage should prove:
- Markdown frontmatter parses correctly
- `references` must be an ordered list
- topic slug must match an allowed topic

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/article-frontmatter.test.ts`
Expected: FAIL because parsing helpers do not exist yet

- [ ] **Step 3: Implement the Markdown article model**

Requirements:
- frontmatter + body parsing
- topic-based file placement
- draft/published support if lightweight
- reference list support

- [ ] **Step 4: Build the writing admin**

Required actions:
- create article
- edit Markdown body
- edit metadata
- assign topic
- toggle published
- mark featured

- [ ] **Step 5: Add validated save behavior**

Requirements:
- write Markdown files safely
- enforce valid topic membership
- keep references structured

- [ ] **Step 6: Re-run tests and verify manually**

Run:
- `npm test -- tests/article-frontmatter.test.ts`
- `npm run dev`

Expected:
- tests pass
- articles can be created and edited in admin

- [ ] **Step 7: Commit**

```bash
git add app/admin/writing app/api/admin/writing features/admin/writing lib/content tests/article-frontmatter.test.ts
git commit -m "feat: add writing management"
```

---

## Task 9: Build site settings and accent color control

**Files:**
- Create: `app/admin/settings/page.tsx`
- Create: `features/admin/settings/site-settings-form.tsx`
- Create: `app/api/admin/settings/route.ts`
- Modify: `content/settings/site.json`
- Modify: `content/settings/navigation.json`

- [ ] **Step 1: Add editable site settings**

Include:
- site title
- short description
- accent color
- optional footer text

- [ ] **Step 2: Connect accent color to the public theme**

Requirements:
- CSS variable driven
- admin changes update buttons, links, and highlights
- keep overall dark theme fixed

- [ ] **Step 3: Allow navigation settings to stay content-aware**

Behavior:
- base navigation can be configured
- case studies and writing links still obey visibility rules

- [ ] **Step 4: Verify manually**

Run: `npm run dev`
Expected: accent color updates the site without exposing wider theme controls

- [ ] **Step 5: Commit**

```bash
git add app/admin/settings app/api/admin/settings features/admin/settings content/settings app/globals.css
git commit -m "feat: add site settings and accent color"
```

---

## Task 10: Add GitHub-backed persistence and Vercel deployment flow

**Files:**
- Create: `lib/github/client.ts`
- Create: `lib/github/commits.ts`
- Modify: `lib/content/writers.ts`
- Modify: `.env.example`
- Modify: `README.md`

- [ ] **Step 1: Add environment variables for GitHub-backed saves**

Required env vars:
- `GITHUB_TOKEN`
- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_BRANCH`
- `ADMIN_PASSWORD`

- [ ] **Step 2: Implement GitHub file update helpers**

Behavior:
- read current file SHA
- update JSON or Markdown file contents
- write useful commit messages per content type

- [ ] **Step 3: Switch writers to production-safe GitHub-backed saves**

Target result:
- local development can use direct filesystem writes
- production saves go through GitHub

- [ ] **Step 4: Verify end-to-end**

Run: `npm run dev`
Expected:
- admin save succeeds
- GitHub commit is created
- Vercel rebuilds from the pushed change

- [ ] **Step 5: Commit**

```bash
git add lib/github lib/content/writers.ts .env.example README.md
git commit -m "feat: connect cms saves to github"
```

---

## Task 11: Add lightweight media support

**Files:**
- Create: `app/api/admin/media/route.ts`
- Create: `features/admin/media/media-library.tsx`
- Create: `public/uploads/.gitkeep`

- [ ] **Step 1: Define v1 media rules**

Rules:
- image-focused only
- conservative file size limits
- suitable for lightweight pro sites

- [ ] **Step 2: Build media upload and selection**

Target behavior:
- upload image
- reuse image path in home blocks
- keep storage model simple

- [ ] **Step 3: Verify manually**

Run: `npm run dev`
Expected: images can be inserted into allowed sections

- [ ] **Step 4: Commit**

```bash
git add app/api/admin/media features/admin/media public/uploads
git commit -m "feat: add lightweight media support"
```

---

## Task 12: Polish the starter experience

**Files:**
- Modify: `README.md`
- Modify: `content/home/home.json`
- Modify: `content/settings/site.json`
- Modify: `content/writing/topics.json`
- Add: one sample Markdown article

- [ ] **Step 1: Add clean starter content**

Include:
- personal-site style placeholder home blocks
- no case studies by default
- at least one sample article so writing flow is visible

- [ ] **Step 2: Document browser-only editing flows**

Document:
- edit home blocks
- add first case study
- create first article
- change accent color

- [ ] **Step 3: Smoke test the main product promises**

Run:
- `npm run dev`
- edit home content
- publish one case study
- publish one article

Expected:
- home is editable
- case studies appear only after publish
- writing topic grid appears only after publish

- [ ] **Step 4: Commit**

```bash
git add README.md content
git commit -m "docs: polish starter experience"
```

---

## Risks and Mitigations

- GitHub-backed saves are slower than database writes.
  Mitigation: show explicit saving, success, and failure states in admin.

- A block system can grow uncontrolled if too many block types are added too early.
  Mitigation: keep the v1 block list fixed and add new types only when real use proves the need.

- Markdown editing is lighter to build, but weaker than a polished editor for some users.
  Mitigation: accept this tradeoff because your writing style fits Markdown well and source structure matters more than WYSIWYG formatting.

- Repository-based media storage does not scale well for heavy asset libraries.
  Mitigation: keep v1 focused on lightweight professional sites with limited images.

- Reusable-for-many architecture can bloat a personal project if overdone.
  Mitigation: optimize first for your own site and only generalize where the extra effort is small.

---

## Recommended Delivery Order

1. Scaffold the app.
2. Define schemas and defaults.
3. Build loaders and visibility rules.
4. Render the public site.
5. Build admin auth and shell.
6. Build the home block editor.
7. Build case study management.
8. Build writing management.
9. Add settings and accent color.
10. Connect GitHub-backed persistence.
11. Add lightweight media support.
12. Polish the starter experience.
