import { getDashboardSession } from "@/shared/lib/dashboard-auth";
import { redirect } from "next/navigation";
import { MenuManager } from "@/modules/menu/components/MenuManager";

export default async function MenuPage() {
  const session = await getDashboardSession();
  if (!session) redirect("/dashboard/login");

  return <MenuManager restaurantId={session.restaurantId} />;
}
