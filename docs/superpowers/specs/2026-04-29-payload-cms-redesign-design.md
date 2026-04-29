# Payload CMS and Chakra Redesign Spec

- Date: 2026-04-29
- Scope: Pre-production replacement of the current custom CMS, admin, and styling architecture

## Goal

Replace the project's current custom content system, admin interface, and legacy global styling with a unified stack built on:

- `Payload CMS` for content and admin
- `Neon Postgres` for hosted persistence
- `Chakra UI` for theming and presentation architecture

This is not an incremental compatibility project. The intent is to remove the old system and rebuild the product around the new stack cleanly.

## Product Direction

### Visual Direction

The visual language is:

- dark-mode only
- black and charcoal dominant
- one bright accent color
- angular and modern
- restrained typography
- technical / product / hacker-adjacent
- explicitly not WordPress-like, site-builder-like, or oversized editorial typography

Reference style direction:

- Chakra UI docs in dark mode
- Supabase in dark mode
- Vercel in dark mode
- Payload in dark mode
- Neon brand/site sensibility as a secondary tone reference

### Non-Goals

- no dual CMS support
- no transitional legacy admin
- no visual preservation of the current CSS architecture
- no rollback-oriented implementation track
- no oversized hero typography
- no multi-color marketing look

## Current-State Problems

The current project has several architectural issues that directly block the redesign:

- `src/app/globals.css` contains both system tokens and large numbers of concrete component/layout classes
- site and admin styling live in the same legacy CSS layer
- theme logic is partially driven by runtime CSS variables and partially by class-based styling
- custom draft/content helpers create a large bespoke maintenance surface
- public rendering depends on custom content structures instead of a general-purpose CMS model

These problems are why the redesign cannot be treated as a simple reskin.

## Target Architecture

The rebuilt project should have three clear layers.

### 1. Content Layer

Payload becomes the only content source.

Use Payload `globals` for:

- site settings
- navigation
- other singleton configuration

Use Payload `collections` for:

- articles / writing content
- case studies
- media
- any reusable structured content types

Use Payload `blocks` for:

- home page sections
- content-composed marketing sections
- rich modular page assembly where needed

The old Git-backed content files, draft-storage system, and custom admin mutation routes are removed.

### 2. Presentation Layer

Chakra UI owns:

- color tokens
- typography scale
- spacing scale
- radii
- borders
- shadows
- focus states
- component variants
- layout primitives

`globals.css` is reduced to the minimum required base layer only. It should not remain the primary expression of the design system.

### 3. Composition Layer

Page components should compose:

- Payload-backed data queries
- Chakra primitives and local design-system components
- page/section-specific rendering logic

This layer should not own global theme rules or CMS persistence logic.

## Data and Platform Design

### Payload

Payload lives inside the existing Next.js app as the backend/admin foundation.

Expected responsibilities:

- schema-defined content modeling
- admin UI
- API and local server-side access
- auth for content management
- migration-managed schema evolution

### Neon Postgres

Neon is the persistence layer for Payload.

Planned usage assumptions:

- hosted Postgres, no self-hosted DB infrastructure
- free tier acceptable for initial project stage
- compute scales to zero on inactivity and resumes automatically
- connection pooling should be used for runtime traffic

Important interpretation notes:

- `0.5 GB storage` means database rows and schema must stay lean; media should not be stored in Postgres blobs
- `scales to zero` means first request after idle may have a cold-start penalty
- `autoscaling up to 2 CU` means small-project elasticity without manual server management
- `10 branches per project` means database branch environments, not site deploy environments

### Media Strategy

Do not store large media payloads in Postgres.

Initial direction:

- keep media strategy separate from the database decision
- use Payload upload collections
- choose local dev storage and a hosted object storage strategy for deployed environments

This should be finalized during implementation planning.

## UX and UI System

### Design Principles

- restraint over spectacle
- clarity over decoration
- edge definition over soft glassmorphism
- compact hierarchy over giant hero type
- consistent surfaces over one-off section aesthetics

### Theme Intent

The Chakra theme should define:

- a near-black app background
- one accent used consistently for focus, interactive emphasis, and status highlights
- low-noise surface hierarchy
- angular component shapes with small radii
- compact text scale with deliberate line-height control
- border-led component definition

### Public Site

The public site should feel like a polished product site or technical personal brand, not a template.

Characteristics:

- measured spacing
- compact hero treatment
- clear navigation
- strong contrast
- section rhythm without giant headlines
- cards and panels defined by edges, not soft decoration

### Admin / Authoring Surface

Payload provides the main admin, but any project-level wrappers or custom views around it should share the same visual language:

- same dark base
- same accent
- same border logic
- same typography restraint

The admin should look related to the public product, not like a separate leftover tool.

## Hard Cutover Plan

The implementation should follow a destroy-and-rebuild sequence rather than compatibility layering.

### Phase A: Purge Legacy CMS and Styling Foundations

Remove:

- custom admin pages and helpers that are only meaningful for the old CMS flow
- custom content mutation API routes tied to the old system
- old draft-storage and content-editing support code once no longer needed for extraction
- legacy styling classes and theme variables that only serve the removed UI

If migration extraction logic needs temporary access to legacy structures, isolate it as short-lived tooling, not as a runtime compatibility layer.

### Phase B: Establish New Core

Add:

- Payload setup
- Neon configuration
- Payload collections/globals/blocks
- Chakra provider and theme architecture
- new root/layout composition strategy

### Phase C: Rebuild Public Experience

Rebuild:

- site shell
- navigation
- page structures
- section rendering
- content cards
- writing views
- case-study views

All rebuilt views should consume Payload data and Chakra components only.

### Phase D: Final Cleanup

Delete any remaining:

- dead routes
- dead loaders
- dead schema utilities
- dead CSS classes
- dead admin utilities

The end state should not contain dormant legacy CMS architecture.

## Testing Strategy

Because this is a destructive architectural replacement, verification should focus on system behavior rather than snapshotting the old implementation.

Minimum verification areas:

- Payload boots correctly in the Next.js app
- Neon database connection works in local development
- auth/admin access works
- create, edit, publish, and fetch flows work for key content types
- public site pages render correctly from Payload data
- Chakra theme is applied consistently across root layouts
- no legacy admin/content routes remain reachable

## Risks

### Main Risks

- underestimating how much of the existing app depends on the custom content model
- deleting legacy code before extracting enough structure to map into Payload cleanly
- allowing Chakra usage to become ad hoc instead of theme-driven
- introducing mixed data access patterns during rebuild

### Risk Controls

- define Payload schema before broad UI rebuilding
- create a clear mapping from current content concepts to Payload models
- keep all new visual rules in Chakra theme/components first
- aggressively remove dead code after each subsystem replacement

## Deliverables

This design produces two documentation artifacts:

- the ADR for the architecture decision
- this redesign spec for product direction and cutover approach

The next implementation artifact should be a detailed execution plan that decomposes the rebuild into safe, ordered steps.
