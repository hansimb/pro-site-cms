"use client";

import { useState } from "react";
import { readDraftSection, writeDraftSection } from "@/lib/content/draft-storage";
import { useAdminAction } from "@/features/admin/shared/use-admin-action";
import type { SiteSettings } from "@/lib/content/schema";

export function SiteSettingsForm({
  editMode,
  initialSettings,
}: {
  editMode: "LOCAL" | "GITHUB";
  initialSettings: SiteSettings;
}) {
  const startingSettings =
    editMode === "GITHUB"
      ? readDraftSection<SiteSettings>("settings") ?? initialSettings
      : initialSettings;
  const [settings, setSettings] = useState(startingSettings);
  const action = useAdminAction("Idle");

  async function saveSettings() {
    if (editMode === "GITHUB") {
      await action.run(async () => {
        writeDraftSection("settings", settings);
      }, {
        pending: "Saving draft...",
        success: "Draft saved.",
        error: "Draft save failed.",
      });
      return;
    }

    await action.run(async () => {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          siteSettings: settings,
        }),
      });

      if (!response.ok) {
        throw new Error("Save failed");
      }
    }, {
      pending: "Saving...",
      success: "Saved.",
      error: "Save failed.",
    });
  }

  return (
    <section className="admin-panel">
      <div className="meta-row">
        <h2 className="content-card-title">Site settings</h2>
        <span className="status-text">{action.message}</span>
      </div>
      <div className="admin-form">
        <div className="field">
          <label htmlFor="site-title">Site title</label>
          <input
            id="site-title"
            onChange={(event) => setSettings({ ...settings, siteTitle: event.target.value })}
            value={settings.siteTitle}
          />
        </div>
        <div className="field">
          <label htmlFor="site-description">Site description</label>
          <textarea
            id="site-description"
            onChange={(event) =>
              setSettings({ ...settings, siteDescription: event.target.value })
            }
            value={settings.siteDescription}
          />
        </div>
        <div className="admin-grid">
          <div className="field">
            <label htmlFor="accent-color">Accent color</label>
            <input
              id="accent-color"
              onChange={(event) => setSettings({ ...settings, accentColor: event.target.value })}
              type="color"
              value={settings.accentColor}
            />
          </div>
          <div className="field">
            <label htmlFor="background-color">Background color</label>
            <input
              id="background-color"
              onChange={(event) => setSettings({ ...settings, backgroundColor: event.target.value })}
              type="color"
              value={settings.backgroundColor}
            />
          </div>
          <div className="field">
            <label htmlFor="gradient-color">Gradient color</label>
            <input
              id="gradient-color"
              onChange={(event) => setSettings({ ...settings, gradientColor: event.target.value })}
              type="color"
              value={settings.gradientColor}
            />
          </div>
          <div className="field">
            <label htmlFor="surface-color">Surface color</label>
            <input
              id="surface-color"
              onChange={(event) => setSettings({ ...settings, surfaceColor: event.target.value })}
              type="color"
              value={settings.surfaceColor}
            />
          </div>
          <div className="field">
            <label htmlFor="text-color">Text color</label>
            <input
              id="text-color"
              onChange={(event) => setSettings({ ...settings, textColor: event.target.value })}
              type="color"
              value={settings.textColor}
            />
          </div>
          <div className="field">
            <label htmlFor="muted-color">Muted text color</label>
            <input
              id="muted-color"
              onChange={(event) => setSettings({ ...settings, mutedColor: event.target.value })}
              type="color"
              value={settings.mutedColor}
            />
          </div>
          <div className="field">
            <label htmlFor="gradient-style">Gradient style</label>
            <select
              id="gradient-style"
              onChange={(event) => setSettings({ ...settings, gradientStyle: event.target.value as SiteSettings["gradientStyle"] })}
              value={settings.gradientStyle}
            >
              <option value="radial">Radial top</option>
              <option value="diagonal">Diagonal</option>
              <option value="soft">Soft glow</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="typography-style">Typography</label>
            <select
              id="typography-style"
              onChange={(event) => setSettings({ ...settings, typographyStyle: event.target.value as SiteSettings["typographyStyle"] })}
              value={settings.typographyStyle}
            >
              <option value="editorial">Editorial</option>
              <option value="technical">Technical</option>
              <option value="plain">Plain</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="radius-style">Corner style</label>
            <select
              id="radius-style"
              onChange={(event) => setSettings({ ...settings, radiusStyle: event.target.value as SiteSettings["radiusStyle"] })}
              value={settings.radiusStyle}
            >
              <option value="sharp">Sharp</option>
              <option value="balanced">Balanced</option>
              <option value="soft">Soft</option>
            </select>
          </div>
        </div>
        <div className="field">
          <label htmlFor="footer-text">Footer text</label>
          <textarea
            id="footer-text"
            onChange={(event) => setSettings({ ...settings, footerText: event.target.value })}
            value={settings.footerText ?? ""}
          />
        </div>
        <div className="meta-row">
          <button
            className="button-primary"
            data-status={action.state}
            onClick={saveSettings}
            type="button"
          >
            {editMode === "GITHUB" ? "Save draft" : "Save settings"}
          </button>
        </div>
      </div>
    </section>
  );
}
