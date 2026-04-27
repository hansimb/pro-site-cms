import { SiteSettingsForm } from "@/features/admin/settings/site-settings-form";
import { getSiteSettings } from "@/lib/content/loaders";
import { getEditMode } from "@/lib/env";

export default async function AdminSettingsPage() {
  const siteSettings = await getSiteSettings();
  const editMode = getEditMode();

  return (
    <div className="admin-page">
      <header className="page-header">
        <div className="eyebrow">Admin</div>
        <h1 className="page-title">Settings</h1>
        <p>
          Keep the design system minimal: title, description, footer text, and one
          accent color that drives the site identity.
        </p>
      </header>
      <SiteSettingsForm editMode={editMode} initialSettings={siteSettings} />
    </div>
  );
}
