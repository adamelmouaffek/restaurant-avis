import { getDashboardSession } from "@/shared/lib/dashboard-auth";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { redirect } from "next/navigation";
import { StatsCards } from "@/modules/avis/components/StatsCards";

export default async function StatsPage() {
  const session = await getDashboardSession();
  if (!session) redirect("/dashboard/login");

  const restaurantId = session.restaurantId;

  const [reviewsRes, participationsRes, prizesRes] = await Promise.all([
    supabaseAdmin
      .from("reviews")
      .select("rating")
      .eq("restaurant_id", restaurantId),
    supabaseAdmin
      .from("participations")
      .select("id")
      .eq("restaurant_id", restaurantId),
    supabaseAdmin
      .from("participations")
      .select("id")
      .eq("restaurant_id", restaurantId)
      .eq("claimed", true),
  ]);

  const reviews = reviewsRes.data || [];
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;
  const totalParticipations = participationsRes.data?.length || 0;
  const totalPrizes = prizesRes.data?.length || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Statistiques</h1>
        <p className="text-muted-foreground mt-1">
          Donnees detaillees de votre restaurant
        </p>
      </div>

      <StatsCards
        totalReviews={totalReviews}
        avgRating={avgRating}
        totalParticipations={totalParticipations}
        totalPrizes={totalPrizes}
      />
    </div>
  );
}
