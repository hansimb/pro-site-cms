"use client";

import { useState } from "react";
import type { SiteSettings } from "@/lib/content/schema";

export function SiteSettingsForm({ initialSettings }: { initialSettings: SiteSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [status, setStatus] = useState("Idle");

  async function saveSettings() {
    setStatus("Saving...");
    const response = await fetch("/api/admin/settings", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        siteSettings: settings,
      }),
    });

    setStatus(response.ok ? "Saved." : "Save failed.");
  }

  return (
    <section className="admin-panel">
      <div className="meta-row">
        <h2 className="content-card-title">Site settings</h2>
        <span className="status-text">{status}</span>
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
          <label htmlFor="footer-text">Footer text</label>
          <textarea
            id="footer-text"
            onChange={(event) => setSettings({ ...settings, footerText: event.target.value })}
            value={settings.footerText ?? ""}
          />
        </div>
        <div className="meta-row">
          <button className="button-primary" onClick={saveSettings} type="button">
            Save settings
          </button>
        </div>
      </div>
    </section>
  );
}
