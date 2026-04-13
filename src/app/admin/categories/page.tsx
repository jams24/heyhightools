import { requireAdmin } from "@/lib/requireAdmin";
import CategoriesClient from "./CategoriesClient";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  await requireAdmin();
  return <CategoriesClient />;
}
