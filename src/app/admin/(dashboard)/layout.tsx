import type { ReactNode } from "react";
import Link from "next/link";
import { LogoutButton } from "@/features/admin/auth/logout-button";
import { requireAdminPageAccess } from "@/lib/auth/require-admin";

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  await requireAdminPageAccess();

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="site-brand">Pro Site CMS</div>
        <nav className="admin-sidebar-links">
          <Link href="/admin/home">Home</Link>
          <Link href="/admin/case-studies">Case studies</Link>
          <Link href="/admin/writing">Writing</Link>
          <Link href="/admin/settings">Settings</Link>
          <Link href="/">Visit site</Link>
        </nav>
        <LogoutButton />
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}
