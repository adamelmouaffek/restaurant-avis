import { getDashboardSession } from "@/shared/lib/dashboard-auth";
import { redirect } from "next/navigation";
import { ReviewsTable } from "@/modules/avis/components/ReviewsTable";
import { PageTransition } from "@/shared/components/animations";

export default async function ReviewsPage() {
  const session = await getDashboardSession();
  if (!session) redirect("/dashboard/login");

  return (
    <PageTransition>
      <ReviewsTable restaurantId={session.restaurantId} />
    </PageTransition>
  );
}
