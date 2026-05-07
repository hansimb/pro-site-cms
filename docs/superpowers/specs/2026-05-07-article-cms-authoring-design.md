# Article CMS Authoring Design

Date: 2026-05-07
Status: Draft for review

## Goal

Improve the article authoring and publishing flow so long-form analytical articles can be written quickly in the Payload CMS rich text editor, published as strong evergreen web articles, and prepared for later PDF export without forcing the author to write in the browser-only as the single source of truth.

This first iteration is optimized for:

- fast writing inside Payload drafts
- in-article images that support claims
- structured references for IEEE-style citation
- strong SEO and share metadata
- a visible, easy-to-copy citation box

This iteration is intentionally not optimized for:

- PDF export
- hero-image-driven editorial layouts
- news-cycle publishing requirements
- custom authoring outside the CMS

## Product Direction

The public article page should feel like a serious analytical publication rather than a blog post template. Articles should prioritize readability, evidence, and citation clarity.

The CMS should support that by making the authoring path straightforward:

1. Create or edit an article in Payload.
2. Write the body in the rich text editor.
3. Insert images within the text where they support specific claims.
4. Maintain a structured references list in the article document.
5. Use inline citation markers like `[1]`, `[2]`, `[3]` inside the prose.
6. Publish when ready and rely on revalidation to update the public site quickly.

## Scope

### In Scope

- Extend the `articles` collection with structured SEO and citation metadata.
- Improve article rendering for long-form analysis.
- Support in-body images and captions through the existing Payload rich text workflow.
- Keep references as a structured array on the article.
- Convert inline IEEE-style citation markers into clickable links to the references section.
- Add a "Cite this analysis" box to the public article page.
- Improve route metadata for article pages.

### Out of Scope

- PDF generation or download pipeline
- hover-preview reference tooltips
- hero image support
- a custom markdown or LaTeX authoring pipeline
- a full custom Lexical editor rebuild unless required to unlock essential image support

## Current State

The current `articles` collection supports:

- title
- slug
- topic
- excerpt
- published date
- featured flag
- rich text content
- references array with `label` and `url`

The public article page currently renders:

- title
- excerpt
- published date
- rich text body
- references list

Current gaps:

- no dedicated citation metadata
- no structured SEO override fields
- no explicit citation copy UI
- no article-level canonical override
- no inline citation linking behavior
- no clearly defined article schema for evergreen analytical publishing

## Proposed Data Model

### Article Fields

Keep the existing fields and add:

- `seoTitle`: optional text override for metadata title
- `seoDescription`: optional textarea override for metadata description
- `canonicalUrl`: optional text field for canonical override
- `keywords`: optional array of keyword rows with a single text field
- `citationTitle`: optional text override used in the citation box
- `citationAuthors`: optional text field for author name formatting
- `citationPublication`: optional text field, defaulting to the site title if empty

### References

Keep `references` as a structured array but expand each row to support better display and citation quality:

- `label`: required text
- `url`: required text
- `publisher`: optional text
- `publishedAt`: optional date
- `accessedAt`: optional date

References remain ordered manually by the author. The order in the array becomes the IEEE reference number.

## Rich Text Authoring

The article body continues to use Payload rich text. The system should support a long-form analytical writing pattern:

- headings for section hierarchy
- paragraphs for argument development
- links
- ordered and unordered lists
- in-body images
- captions attached to those images

If current editor configuration already supports image embeds with captions, reuse that path. If not, add the smallest possible editor enhancement needed to unlock in-body figure support without turning this task into an editor platform rewrite.

Table support should be enabled only if already feasible in the current editor configuration or available with low-risk setup. If table support is not low-risk in this iteration, the fallback is to defer full tables and allow near-term use of images for charts and tables.

## Inline Citation Behavior

Authors will write citation markers directly in prose using IEEE-style notation like `[1]`, `[2]`, and `[3]`.

Rendering rules:

- A citation marker is recognized only when its number maps to an existing item in `references`.
- A recognized citation becomes a clickable inline link.
- The link target is the matching item in the `References` section.
- Unmatched markers remain plain text to avoid incorrect links.

This behavior should happen at render time on the public article page rather than mutating editor content. That keeps authoring simple and avoids introducing fragile editor-side transforms.

## Public Article Experience

The article page should present:

- article title
- excerpt
- published date
- updated date when available
- topic context
- long-form rich text content
- inline linked citations
- references section with stable anchors
- a "Cite this analysis" box

The citation box should offer a ready-to-copy plain text citation string built from article metadata. First iteration requirements:

- visible citation label
- copy action
- fallback formatting if citation-specific overrides are empty

A reasonable initial citation pattern is:

`Author, "Title," Publication, Date. [Online]. Available: URL`

Exact formatting can be refined later without changing the underlying data model.

## Metadata and Discoverability

Article metadata should prioritize evergreen discoverability and professional presentation, not news-specific signaling.

The article route metadata should:

- prefer `seoTitle` over article title when present
- prefer `seoDescription` over excerpt when present
- use article canonical when provided
- set article Open Graph metadata
- set Twitter summary large image behavior if global imagery exists
- include article publication and modification dates when available

This keeps the system aligned with long-form search visibility and clean sharing behavior while avoiding over-optimizing for freshness-based distribution channels.

## Rendering Strategy

Implementation should favor the smallest reliable changes:

1. Extend the article collection schema.
2. Extend data loading so the article page receives the new fields.
3. Update metadata generation helpers to consume the new fields.
4. Update article rendering to:
   - show stronger article meta
   - parse and link inline citations
   - render the improved references section
   - show the citation box

The existing revalidation hooks should remain in place so published changes propagate to the public site quickly.

## Error Handling and Fallbacks

- Missing optional SEO fields fall back to article title and excerpt.
- Missing citation-specific fields fall back to site title and general article metadata.
- Broken citation markers do not throw and do not render dead links.
- Missing image captions do not block render.
- Missing optional reference fields do not block publication.

## Testing Strategy

Add tests that cover:

- article metadata fallback behavior
- canonical URL handling when present
- inline citation conversion for valid references
- non-conversion for invalid citation markers
- citation box formatting fallback behavior
- references section anchor stability

If rich text image support requires configuration changes, add a targeted test for the article data contract where practical.

## Rollout

Phase 1 in this task:

- article schema updates
- page rendering updates
- metadata updates
- citation linking
- citation box

Deferred phase:

- PDF export
- hover reference previews
- advanced data tables
- richer citation formats

## Open Decisions Resolved

- No hero image in this article format.
- Images belong inside the text where they support claims.
- Evergreen analytical quality is prioritized over fast-aging news optimization.
- Payload rich text remains the writing interface.
- IEEE-style inline references are supported through render-time linking to the references section.
