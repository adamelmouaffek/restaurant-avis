import { getDashboardSession } from "@/shared/lib/dashboard-auth";
import { redirect } from "next/navigation";
import { ReviewsTable } from "@/modules/avis/components/ReviewsTable";

export default async function ReviewsPage() {
  const session = await getDashboardSession();
  if (!session) redirect("/dashboard/login");

  return <ReviewsTable restaurantId={session.restaurantId} />;
}
