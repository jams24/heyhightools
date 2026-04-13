import { requireAdmin } from "@/lib/requireAdmin";
import EditProductClient from "./EditProductClient";

export const dynamic = "force-dynamic";

export default async function EditProductPage() {
  await requireAdmin();
  return <EditProductClient />;
}
