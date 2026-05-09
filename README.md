# imberg.dev CMS

`pro-site-cms` is a Next.js + Payload CMS portfolio site backed by Neon Postgres. It powers a personal site with a block-based homepage, structured case studies, writing, CMS-managed SEO, and small "ongoing building" GitHub/WakaTime signals.

## What it includes

- Payload admin embedded into the same Next.js app
- Postgres-backed content model for articles, case studies, media, globals, and homepage blocks
- block-based homepage with hero, timeline, highlights, case studies, contact CTA, and GitHub profile stats
- CMS-managed site settings for navigation, contact links, social links, and default SEO
- server-rendered site data through Payload Local API
- generated metadata, robots, sitemap, favicon, Apple icon, and social images
- GitHub and WakaTime stats that render only when reliable data exists

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Payload CMS 3
- Neon Postgres
- Chakra UI 3
- Vitest

## Project structure

- `payload.config.ts` - Payload root config
- `src/payload/collections/*` - collections such as `articles`, `case-studies`, `media`, and `users`
- `src/payload/globals/*` - globals such as `site-settings` and `home-page`
- `src/payload/blocks/home-blocks.ts` - homepage block definitions for the CMS
- `src/features/site/data/*` - mappers from Payload documents into frontend-friendly site models
- `src/features/site/metadata.ts` - metadata builders used by `generateMetadata`
- `src/features/site/github-stats.ts` - GitHub/WakaTime signal fetching and filtering
- `src/app/(site)/*` - public site routes
- `src/app/(payload)/*` - embedded Payload admin and API routes
- `src/migrations/*` - Payload Postgres migrations
- `tests/*` - Vitest coverage for content mapping and UI/data helpers

## Local development

```bash
npm install
npm run dev
```

Open:

- Site: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`

## Environment variables

At minimum, set a database URL and a Payload secret.

```bash
DATABASE_URL=
PAYLOAD_SECRET=
```

The app also supports:

```bash
NEON_CONNECTION_STRING=
GITHUB_TOKEN=
GITHUB_API=
WAKATIME_API_KEY=
```

Notes:

- `DATABASE_URL` takes precedence over `NEON_CONNECTION_STRING`
- `PAYLOAD_SECRET` is required in production
- `GITHUB_TOKEN` is the preferred variable for GitHub stats
- `GITHUB_API` is still supported as a fallback alias
- `WAKATIME_API_KEY` enables tracked coding time

## GitHub / WakaTime signals

The homepage GitHub block supports:

- public repositories
- contributions in the last year
- all-time contributions
- tracked coding time
- production deployments

These signals are intentionally conservative:

- cards are shown only when a reliable value is returned
- `0`, empty, or failed values are not rendered
- if a stat cannot be fetched, it is omitted instead of showing a fake fallback

For production deployments, set a repository URL in the homepage GitHub block inside the CMS.

## CMS-managed settings

`Site Settings` currently controls:

- site title and subtitle
- site description
- accent color
- navigation
- contact email
- LinkedIn URL
- GitHub URL
- default SEO fields:
  - site URL
  - meta title
  - meta description
  - Open Graph title/description
  - Twitter title/description
  - `noIndex`

`Home Page` controls:

- hero
- text / callout / quote blocks
- highlights
- timeline
- contact CTA
- featured case studies
- GitHub profile block
- link list

## Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run test
npm run migrate
npm run migrate:create
npm run db:backup  # requires pg_dump on PATH and DATABASE_URL or NEON_CONNECTION_STRING
```

## Data flow

The public site does not fetch its own REST API from the browser. Instead:

1. Payload stores content in Neon Postgres
2. server components call Payload Local API on the server
3. mapper functions normalize Payload documents into frontend site models
4. pages render those normalized models

This keeps the UI independent from raw Payload document shapes.

## Deployment notes

- make sure production has `PAYLOAD_SECRET` set
- make sure production points at the intended Neon branch via `DATABASE_URL`
- GitHub and WakaTime signals depend on valid server-side env vars
- if you add new Payload fields, run the corresponding migration before expecting them in production

## Verification

Typical verification flow:

```bash
npm run typecheck
npm run test
npm run build
```

## Current direction

This repo is no longer the original file-based CMS prototype. It is now a Payload-first portfolio platform centered around:

- structured content
- CMS-managed homepage composition
- business-aware developer branding
- lightweight production signals from real tools and repositories
