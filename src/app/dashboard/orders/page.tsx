import { getDashboardSession } from "@/shared/lib/dashboard-auth";
import { redirect } from "next/navigation";
import { OrdersManager } from "@/modules/menu/components/OrdersManager";

export default async function OrdersPage() {
  const session = await getDashboardSession();
  if (!session) redirect("/dashboard/login");

  return <OrdersManager restaurantId={session.restaurantId} />;
}
