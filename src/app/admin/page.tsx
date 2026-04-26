import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth/require-admin";

export default async function AdminIndexPage() {
  const authenticated = await isAdminAuthenticated();
  redirect(authenticated ? "/admin/home" : "/admin/login");
}
