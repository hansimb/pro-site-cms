# Contact Experience and GitHub Signal Spec

- Date: 2026-05-03
- Scope: Homepage contact UX, responsive header behavior, CMS-managed social/contact settings, and GitHub profile block

## Goal

Make contact actions immediate and easy across the site while keeping the UI clean, data-driven, and safe against broken or misleading fallbacks.

This work adds:

- a shared contact modal
- responsive header behavior with a mobile burger menu
- CMS-managed email / LinkedIn / GitHub settings
- a homepage GitHub profile block with server-fetched stats

The product goal is not to add a full contact form. The goal is to reduce friction around reaching out and exploring public work.

## Current-State Problems

- Contact is not surfaced as a first-class interaction pattern.
- The current header is too narrow for future mobile additions.
- Social/profile links are not modeled in site settings.
- The contact CTA still uses a GitHub-oriented action even though GitHub should be promoted separately.
- There is no safe, structured way to show GitHub or WakaTime signal without risking junk fallback values.

## Product Direction

### Contact UX

The site should make email the primary contact method without forcing the user straight into `mailto:`.

Users should be able to:

- see the email address clearly
- copy it in one click
- still open their mail client if they want
- jump to LinkedIn when that is available

This should feel deliberate and low-friction rather than like a basic link dump.

### GitHub Presence

GitHub should be promoted as a separate proof-of-work surface rather than as a secondary CTA inside the contact section.

The homepage should be able to show:

- a small number of trustworthy profile stats
- a direct link to the GitHub profile or a chosen repo destination
- clean fallback behavior when external APIs do not return usable data

## Information Architecture

### Site Settings

`site-settings` should gain a new contact/social group for global identity links:

- `email`
- `linkedinUrl`
- `githubUrl`

These are optional at the schema level, but the UI must only render the related controls when the corresponding field is present and valid.

### Homepage Blocks

The existing `contactCta` block remains, but its role changes:

- primary button: email / contact modal entry
- secondary button: LinkedIn
- GitHub is removed from this block

A new homepage block is added for GitHub promotion:

- `githubProfile`
- heading
- intro
- CTA label
- CTA URL

The GitHub block owns presentation copy and destination links, while live stats are fetched server-side.

## UI Design

### Header

#### Desktop

The desktop header should contain:

- site title / subtitle on the left
- primary navigation
- a lightweight `Contact` action
- GitHub icon, only if `githubUrl` exists
- LinkedIn icon, only if `linkedinUrl` exists

Icons should stay compact and feel like utility actions, not equal-weight nav items.

#### Mobile

The mobile header should move to a drawer-based pattern:

- optional GitHub / LinkedIn icons remain visible beside the trigger when data exists
- a burger trigger opens the navigation drawer
- the drawer contains the normal nav links and the `Contact` action

This keeps the top bar compact without hiding useful profile shortcuts.

### Shared Contact Modal

The `Contact` action in the header and the email button in the CTA both open the same client-side modal.

The modal should support:

- visible email address
- copy-email action
- `mailto:` action
- LinkedIn action when available

If `email` is missing, email-specific actions do not render.
If `linkedinUrl` is missing, the LinkedIn action does not render.
No placeholder labels or disabled junk buttons should appear.

### Footer

The footer should expose contact persistently but lightly.

If `email` exists, show:

- visible email address
- copy action with icon

If no email exists, no email affordance is shown.

Copyright is optional and not required by this change.

### Contact CTA

The CTA stays editorial in tone but becomes more practical.

Buttons become:

- `Email`
- `LinkedIn`

The email button opens the shared modal instead of linking directly to `mailto:`.
The LinkedIn button appears only when `linkedinUrl` exists.

### GitHub Profile Block

This block should sit naturally below featured case studies.

Recommended structure:

- heading + intro
- 2-3 stat cards when trustworthy data exists
- GitHub profile / repo CTA

Possible stat cards:

- public and private repositories
- contributions
- tracked coding hours

The exact set is conditional on what the APIs can provide safely.

## Data Flow

### Contact and Social Settings

Payload stores contact and social values in `site-settings`.

Server-side site model mapping should normalize these values and expose only valid strings to the UI layer. Empty or whitespace-only values should be treated as absent.

### GitHub / WakaTime Data

External stats should be fetched server-side only.

Configuration belongs in environment variables, not in Payload:

- GitHub token in env
- WakaTime token / secret in env

Payload stores only display/config values such as:

- GitHub profile URL
- optional GitHub CTA URL
- block copy

### Safe Rendering Rules

The system must prefer omission over fake fallback data.

Rules:

- if a header social URL is missing, do not render that icon
- if email is missing, do not render email actions
- if a stat fetch fails, omit that stat card
- do not show `0`, `N/A`, or placeholder values for unavailable external stats
- if every stat is unavailable but the GitHub block exists, render intro + CTA only

This protects the site from looking broken or dishonest.

## Technical Design

### Server and Client Boundaries

The site should continue to use server components for layout/data composition wherever possible.

Interactive surfaces become small client islands:

- contact modal controller
- mobile drawer navigation
- copy-to-clipboard action

These should sit beneath server-rendered layout/content boundaries rather than forcing the whole header or page into client rendering.

### New/Updated Units

Expected implementation units:

- `site-settings` schema extension for contact/social fields
- site data mapper updates for normalized contact/social values
- client contact modal component
- client mobile nav / drawer component
- small reusable icon-link / copy-email helpers
- GitHub stats server utility
- WakaTime stats server utility
- new `githubProfile` Payload block + homepage mapper + renderer

Each should keep one clear responsibility.

## Error Handling

### Contact Data

If contact data is partial:

- render only the actions that are valid
- keep the modal structurally stable without dead controls

### External API Failures

If GitHub or WakaTime fails due to auth, rate limits, missing env, or malformed responses:

- do not throw user-facing errors into the homepage
- omit affected cards
- still allow the GitHub block to render text + CTA when configured

This feature should degrade quietly and safely.

## Testing Strategy

Add tests for:

- site settings mapping with optional contact/social fields
- conditional rendering rules for missing email / LinkedIn / GitHub
- contact CTA behavior and modal data flow
- GitHub block mapping when stats exist
- GitHub block rendering when stats partially fail
- GitHub block rendering when all stats fail

Where external API utilities are involved, mock responses and assert omission behavior instead of relying on live network calls.

## Non-Goals

- no general-purpose contact form
- no CMS-managed API secrets
- no client-side fetching of GitHub/WakaTime stats
- no fake placeholder stats
- no requirement to show copyright text

## Recommendation

Implement the feature as a Payload-driven contact and profile layer with:

- global contact/social settings in `site-settings`
- a shared client contact modal
- a responsive drawer-based mobile header
- a CMS-authored GitHub block backed by server-side stats utilities

This keeps content flexible in CMS, preserves truthful rendering, and improves UX without overcomplicating the site.
