import { getDashboardSession } from "@/shared/lib/dashboard-auth";
import { redirect } from "next/navigation";
import { PrizeConfigForm } from "@/modules/avis/components/PrizeConfigForm";

export default async function PrizesPage() {
  const session = await getDashboardSession();
  if (!session) redirect("/dashboard/login");

  return <PrizeConfigForm restaurantId={session.restaurantId} />;
}
