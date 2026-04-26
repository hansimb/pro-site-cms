"use client";

import type { HomeBlock } from "@/lib/content/schema";

function parseLinkList(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label = "", href = ""] = line.split("|").map((part) => part.trim());
      return { href, label };
    });
}

function serializeLinkList(items: { href: string; label: string }[]) {
  return items.map((item) => `${item.label} | ${item.href}`).join("\n");
}

function parseTimeline(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label = "", title = "", period = "", description = ""] = line
        .split("|")
        .map((part) => part.trim());
      return {
        description,
        label,
        period,
        title,
      };
    });
}

function serializeTimeline(
  items: { description?: string; label: string; period?: string; title: string }[],
) {
  return items
    .map((item) => `${item.label} | ${item.title} | ${item.period ?? ""} | ${item.description ?? ""}`)
    .join("\n");
}

export function BlockFormSwitch({
  block,
  onChange,
}: {
  block: HomeBlock;
  onChange: (block: HomeBlock) => void;
}) {
  switch (block.type) {
    case "hero":
      return (
        <div className="admin-form">
          <div className="field">
            <label htmlFor="hero-eyebrow">Eyebrow</label>
            <input
              id="hero-eyebrow"
              onChange={(event) => onChange({ ...block, eyebrow: event.target.value })}
              value={block.eyebrow}
            />
          </div>
          <div className="field">
            <label htmlFor="hero-heading">Heading</label>
            <textarea
              id="hero-heading"
              onChange={(event) => onChange({ ...block, heading: event.target.value })}
              value={block.heading}
            />
          </div>
          <div className="field">
            <label htmlFor="hero-body">Body</label>
            <textarea
              id="hero-body"
              onChange={(event) => onChange({ ...block, body: event.target.value })}
              value={block.body}
            />
          </div>
          <div className="admin-grid">
            <div className="field">
              <label htmlFor="hero-primary-label">Primary link label</label>
              <input
                id="hero-primary-label"
                onChange={(event) =>
                  onChange({
                    ...block,
                    primaryLink: {
                      href: block.primaryLink?.href ?? "/writing",
                      label: event.target.value,
                    },
                  })
                }
                value={block.primaryLink?.label ?? ""}
              />
            </div>
            <div className="field">
              <label htmlFor="hero-primary-href">Primary link href</label>
              <input
                id="hero-primary-href"
                onChange={(event) =>
                  onChange({
                    ...block,
                    primaryLink: {
                      href: event.target.value,
                      label: block.primaryLink?.label ?? "Primary link",
                    },
                  })
                }
                value={block.primaryLink?.href ?? ""}
              />
            </div>
            <div className="field">
              <label htmlFor="hero-secondary-label">Secondary link label</label>
              <input
                id="hero-secondary-label"
                onChange={(event) =>
                  onChange({
                    ...block,
                    secondaryLink: {
                      href: block.secondaryLink?.href ?? "/case-studies",
                      label: event.target.value,
                    },
                  })
                }
                value={block.secondaryLink?.label ?? ""}
              />
            </div>
            <div className="field">
              <label htmlFor="hero-secondary-href">Secondary link href</label>
              <input
                id="hero-secondary-href"
                onChange={(event) =>
                  onChange({
                    ...block,
                    secondaryLink: {
                      href: event.target.value,
                      label: block.secondaryLink?.label ?? "Secondary link",
                    },
                  })
                }
                value={block.secondaryLink?.href ?? ""}
              />
            </div>
          </div>
        </div>
      );
    case "richText":
      return (
        <div className="admin-form">
          <div className="field">
            <label htmlFor="rich-text-title">Title</label>
            <input
              id="rich-text-title"
              onChange={(event) => onChange({ ...block, title: event.target.value })}
              value={block.title ?? ""}
            />
          </div>
          <div className="field">
            <label htmlFor="rich-text-body">Body</label>
            <textarea
              id="rich-text-body"
              onChange={(event) => onChange({ ...block, body: event.target.value })}
              value={block.body}
            />
          </div>
        </div>
      );
    case "quote":
      return (
        <div className="admin-form">
          <div className="field">
            <label htmlFor="quote">Quote</label>
            <textarea
              id="quote"
              onChange={(event) => onChange({ ...block, quote: event.target.value })}
              value={block.quote}
            />
          </div>
          <div className="field">
            <label htmlFor="quote-attribution">Attribution</label>
            <input
              id="quote-attribution"
              onChange={(event) => onChange({ ...block, attribution: event.target.value })}
              value={block.attribution ?? ""}
            />
          </div>
        </div>
      );
    case "links":
      return (
        <div className="admin-form">
          <div className="field">
            <label htmlFor="links-title">Title</label>
            <input
              id="links-title"
              onChange={(event) => onChange({ ...block, title: event.target.value })}
              value={block.title}
            />
          </div>
          <div className="field">
            <label htmlFor="links-items">Items, one per line: Label | URL</label>
            <textarea
              id="links-items"
              onChange={(event) => onChange({ ...block, items: parseLinkList(event.target.value) })}
              value={serializeLinkList(block.items)}
            />
          </div>
        </div>
      );
    case "featuredArticles":
    case "featuredCaseStudies":
      return (
        <div className="admin-form">
          <div className="field">
            <label htmlFor="featured-title">Title</label>
            <input
              id="featured-title"
              onChange={(event) => onChange({ ...block, title: event.target.value })}
              value={block.title}
            />
          </div>
          <div className="field">
            <label htmlFor="featured-intro">Intro</label>
            <textarea
              id="featured-intro"
              onChange={(event) => onChange({ ...block, intro: event.target.value })}
              value={block.intro ?? ""}
            />
          </div>
          <div className="field">
            <label htmlFor="featured-limit">Limit</label>
            <input
              id="featured-limit"
              min={1}
              onChange={(event) => onChange({ ...block, limit: Number(event.target.value) || 1 })}
              type="number"
              value={block.limit}
            />
          </div>
        </div>
      );
    case "timeline":
      return (
        <div className="admin-form">
          <div className="field">
            <label htmlFor="timeline-title">Title</label>
            <input
              id="timeline-title"
              onChange={(event) => onChange({ ...block, title: event.target.value })}
              value={block.title}
            />
          </div>
          <div className="field">
            <label htmlFor="timeline-items">
              Items, one per line: Label | Title | Period | Description
            </label>
            <textarea
              id="timeline-items"
              onChange={(event) => onChange({ ...block, items: parseTimeline(event.target.value) })}
              value={serializeTimeline(block.items)}
            />
          </div>
        </div>
      );
    case "contactCta":
      return (
        <div className="admin-form">
          <div className="field">
            <label htmlFor="contact-title">Title</label>
            <input
              id="contact-title"
              onChange={(event) => onChange({ ...block, title: event.target.value })}
              value={block.title}
            />
          </div>
          <div className="field">
            <label htmlFor="contact-body">Body</label>
            <textarea
              id="contact-body"
              onChange={(event) => onChange({ ...block, body: event.target.value })}
              value={block.body}
            />
          </div>
          <div className="admin-grid">
            <div className="field">
              <label htmlFor="contact-link-label">Link label</label>
              <input
                id="contact-link-label"
                onChange={(event) =>
                  onChange({
                    ...block,
                    link: {
                      href: block.link.href,
                      label: event.target.value,
                    },
                  })
                }
                value={block.link.label}
              />
            </div>
            <div className="field">
              <label htmlFor="contact-link-href">Link href</label>
              <input
                id="contact-link-href"
                onChange={(event) =>
                  onChange({
                    ...block,
                    link: {
                      href: event.target.value,
                      label: block.link.label,
                    },
                  })
                }
                value={block.link.href}
              />
            </div>
          </div>
        </div>
      );
    case "image":
      return (
        <div className="admin-form">
          <div className="field">
            <label htmlFor="image-src">Image src</label>
            <input
              id="image-src"
              onChange={(event) => onChange({ ...block, src: event.target.value })}
              value={block.src}
            />
          </div>
          <div className="field">
            <label htmlFor="image-alt">Alt text</label>
            <input
              id="image-alt"
              onChange={(event) => onChange({ ...block, alt: event.target.value })}
              value={block.alt}
            />
          </div>
          <div className="field">
            <label htmlFor="image-caption">Caption</label>
            <textarea
              id="image-caption"
              onChange={(event) => onChange({ ...block, caption: event.target.value })}
              value={block.caption ?? ""}
            />
          </div>
        </div>
      );
    case "textBox":
      return (
        <div className="admin-form">
          <div className="field">
            <label htmlFor="textbox-title">Title</label>
            <input
              id="textbox-title"
              onChange={(event) => onChange({ ...block, title: event.target.value })}
              value={block.title ?? ""}
            />
          </div>
          <div className="field">
            <label htmlFor="textbox-body">Body</label>
            <textarea
              id="textbox-body"
              onChange={(event) => onChange({ ...block, body: event.target.value })}
              value={block.body}
            />
          </div>
          <div className="field">
            <label htmlFor="textbox-tone">Tone</label>
            <select
              id="textbox-tone"
              onChange={(event) =>
                onChange({
                  ...block,
                  tone: event.target.value as "accent" | "default" | "muted",
                })
              }
              value={block.tone}
            >
              <option value="default">Default</option>
              <option value="muted">Muted</option>
              <option value="accent">Accent</option>
            </select>
          </div>
        </div>
      );
    default:
      return null;
  }
}
