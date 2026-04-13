import { requireAdmin } from "@/lib/requireAdmin";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();
  return <AdminDashboardClient />;
}
