# Pro Site CMS

`pro-site-cms` is a dark, Git-backed CMS for a professional personal website. It is built for one owner-admin, keeps content in repository files, and can publish through Vercel without relying on a database.

## What it includes

- block-based home page
- structured case studies
- topic-driven writing with Markdown articles
- reference lists in articles
- admin login and browser-based editing
- optional GitHub-backed saves for Vercel deployments
- lightweight image uploads

## Stack

- Next.js App Router
- TypeScript
- React
- Vitest
- Zod
- Gray Matter
- React Markdown

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Admin lives at `http://localhost:3000/admin/login`.

## Environment

Copy `.env.example` to `.env.local` and set at least:

```bash
ADMIN_PASSWORD=change-me
```

If you want production saves to write back to GitHub instead of the local filesystem, also set:

```bash
EDIT_MODE=local | github
GITHUB_TOKEN=
GITHUB_OWNER=
GITHUB_REPO=
GITHUB_BRANCH=main
```

When those GitHub variables are present, JSON, Markdown, and uploaded images are written through the GitHub Contents API. This is the intended mode for Vercel, because Vercel's filesystem is not persistent between deployments.

## Commands

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm test
```

## Content layout

- `content/home/home.json`
- `content/case-studies/index.json`
- `content/writing/topics.json`
- `content/writing/<topic>/*.md`
- `content/settings/site.json`
- `content/settings/navigation.json`

## Notes

- `Case Studies` stays hidden on the public site until at least one case is published.
- `Writing` stays hidden until at least one article is published.
- Topics only appear when they have published articles.
- The admin is intentionally simple and optimized for direct personal use.

--
