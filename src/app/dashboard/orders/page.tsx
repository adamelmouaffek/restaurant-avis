import { getDashboardSession } from "@/shared/lib/dashboard-auth";
import { redirect } from "next/navigation";
import { OrdersManager } from "@/modules/menu/components/OrdersManager";
import { PageTransition } from "@/shared/components/animations";

export default async function OrdersPage() {
  const session = await getDashboardSession();
  if (!session) redirect("/dashboard/login");

  return (
    <PageTransition>
      <OrdersManager restaurantId={session.restaurantId} />
    </PageTransition>
  );
}
