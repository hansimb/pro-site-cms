import { LoginForm } from "@/features/admin/auth/login-form";

export default function AdminLoginPage() {
  return (
    <main className="admin-login-page">
      <section className="admin-login-card section-stack">
        <div className="eyebrow">Admin</div>
        <h1 className="page-title">Sign in to edit the site.</h1>
        <p>
          This is a single-owner admin. Once signed in, you can edit the home page,
          case studies, writing, and accent color directly in the browser.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
