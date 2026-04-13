import { requireAdmin } from "@/lib/requireAdmin";
import ProductsClient from "./ProductsClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireAdmin();
  return <ProductsClient />;
}
