import { getDashboardSession } from "@/shared/lib/dashboard-auth";
import { redirect } from "next/navigation";
import { PrizeConfigForm } from "@/modules/avis/components/PrizeConfigForm";
import { PageTransition } from "@/shared/components/animations";

export default async function PrizesPage() {
  const session = await getDashboardSession();
  if (!session) redirect("/dashboard/login");

  return (
    <PageTransition>
      <PrizeConfigForm restaurantId={session.restaurantId} />
    </PageTransition>
  );
}
