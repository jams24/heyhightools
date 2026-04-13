import { requireAdmin } from "@/lib/requireAdmin";
import OrdersClient from "./OrdersClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  await requireAdmin();
  return <OrdersClient />;
}
