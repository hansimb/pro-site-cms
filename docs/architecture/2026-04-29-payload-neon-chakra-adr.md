# ADR 001: Replace Custom CMS and Legacy Styling with Payload, Neon Postgres, and Chakra UI

- Date: 2026-04-29
- Status: Accepted

## Context

The current project uses a custom Git-backed content system, a custom admin surface, and a large global CSS file that mixes public-site styling, admin styling, theme tokens, and component rules in one layer.

This has led to several problems:

- styling is centralized in a single legacy CSS file with weak boundaries
- public site and admin share presentation concerns in a way that makes redesign risky
- content modeling, drafts, rendering, and admin behavior are tightly coupled to custom code
- the project does not yet reflect the intended visual standard: minimal, dark-only, angular, technical, and product-like rather than builder-like
- the user explicitly does not want two CMS systems or two styling systems running in parallel

The project is pre-production, so a destructive cutover is acceptable. The user prefers a single replacement rather than a staged compatibility layer or rollback-oriented migration.

## Decision

We will replace the current custom CMS and legacy styling architecture with:

- `Payload CMS` as the only content and admin system
- `Neon Postgres` as the hosted database
- `Chakra UI` as the primary theming and component system

This will be a hard cutover:

- legacy custom CMS code will be removed rather than maintained alongside Payload
- legacy admin routes and components will be removed rather than preserved as fallback
- legacy styling classes and theme variables will be removed rather than adapted incrementally

The new system will use Payload as the only authoritative content source and the only admin interface. The frontend will read content from Payload-backed server-side queries instead of repository content files and custom draft storage.

## Why This Decision

### Payload CMS

Payload gives the project a real content model, a production-grade admin, and a code-first backend that fits a Next.js codebase. It removes the need to keep extending a homegrown CMS layer that is already getting in the way of visual and architectural quality.

Payload also fits the user's preference for a cleaner, more deliberate system than the current custom content code.

### Neon Postgres

Neon provides a hosted Postgres database without self-managing infrastructure. This matches the user's requirement to avoid database hosting overhead and ongoing maintenance burden.

Relevant Neon characteristics for this project:

- free plan storage is limited but sufficient for an early CMS-backed site
- scale-to-zero suspends inactive compute after about 5 minutes and resumes automatically on the next query
- autoscaling provides small-project elasticity without manual tuning
- branching can support future schema experimentation if needed
- pooled connections are available and should be preferred for serverless/runtime safety

For Payload, Postgres is a first-class supported option and is a safer production default than trying to force a persistent SQLite workflow onto Vercel-hosted infrastructure.

### Chakra UI

Chakra UI gives the project a single design-token and component system that can drive both the public site and the admin-facing custom surfaces around Payload.

The project needs:

- a disciplined theme layer
- reusable component variants
- strong control over dark-only surfaces, borders, states, and spacing
- a way out of the current global-CSS sprawl

Chakra is chosen not for generic convenience but because it can support the desired visual language while enforcing better architectural boundaries.

## Rejected Alternatives

### Keep the current custom CMS

Rejected because it preserves the same structural problems:

- custom content modeling burden
- custom admin maintenance burden
- high coupling between content, drafts, and rendering
- no durable improvement in editorial/admin ergonomics

### Run old CMS and Payload side by side

Rejected because the user explicitly does not want dual systems. It would also increase complexity during the redesign by creating multiple sources of truth.

### Use SQLite in-repo or on ephemeral hosting

Rejected because a repository is not a live database host, and Vercel's writable filesystem is not a durable production database location. The project needs hosted persistence, not commit-driven state mutation.

### Keep the current CSS and “layer Chakra on top”

Rejected because it would preserve the styling chaos instead of replacing it. The user asked for the old styling architecture to be destroyed, not re-skinned.

## Consequences

### Positive

- one content system instead of two
- one admin system instead of two
- one theme system instead of a large global CSS heap
- clearer boundaries between content model, presentation system, and page composition
- easier evolution of site sections and content structures
- improved long-term maintainability

### Negative

- destructive migration means no built-in fallback path
- existing content loaders, draft helpers, and admin features will be deleted before the new system is complete
- implementation will touch many files and requires disciplined rebuild sequencing
- payload adoption introduces database schema, migrations, and environment configuration work

### Neutral / Operational

- media storage should be treated separately from the relational database
- server-side database access should use environment-managed connection strings
- pooled Neon connections should be used for request-time application access, while direct connections may still be preferred for some migration workflows

## Implementation Direction

1. Remove the existing custom admin and content-management code paths.
2. Remove the legacy CSS architecture that currently drives both site and admin.
3. Install and configure Payload inside the Next.js app.
4. Connect Payload to Neon Postgres.
5. Model content in Payload collections and globals.
6. Rebuild public-site presentation on Chakra UI tokens and components.
7. Rebuild any project-specific admin customizations only after Payload is the base.

## Notes

- Neon free-plan behavior discussed during design should be documented in the implementation spec so it is not rediscovered later.
- This ADR intentionally favors a hard cutover because the project is not in production and the user explicitly rejected rollback-oriented migration.
