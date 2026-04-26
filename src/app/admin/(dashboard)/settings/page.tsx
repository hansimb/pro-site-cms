import { SiteSettingsForm } from "@/features/admin/settings/site-settings-form";
import { getSiteSettings } from "@/lib/content/loaders";

export default async function AdminSettingsPage() {
  const siteSettings = await getSiteSettings();

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
      <SiteSettingsForm initialSettings={siteSettings} />
    </div>
  );
}
