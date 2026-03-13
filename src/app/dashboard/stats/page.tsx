import { getDashboardSession } from "@/shared/lib/dashboard-auth";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { redirect } from "next/navigation";
import { StatsCards } from "@/modules/avis/components/StatsCards";
import { ReviewStats } from "@/modules/avis/components/ReviewStats";
import { PageTransition, FadeIn } from "@/shared/components/animations";

export default async function StatsPage() {
  const session = await getDashboardSession();
  if (!session) redirect("/dashboard/login");

  const restaurantId = session.restaurantId;

  // Fetch all review data + participations
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [reviewsRes, recentReviewsRes, participationsRes, prizesRes] =
    await Promise.all([
      supabaseAdmin
        .from("reviews")
        .select("rating")
        .eq("restaurant_id", restaurantId),
      supabaseAdmin
        .from("reviews")
        .select("rating, created_at")
        .eq("restaurant_id", restaurantId)
        .gte("created_at", thirtyDaysAgo)
        .order("created_at", { ascending: true }),
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
  const recentReviews = recentReviewsRes.data || [];
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;
  const totalParticipations = participationsRes.data?.length || 0;
  const totalPrizes = prizesRes.data?.length || 0;

  // --- NPS calculation (based on rating 1-5 → detractors/passives/promoters) ---
  // 1-2 = detractors, 3 = passives, 4-5 = promoters
  const detractors = reviews.filter((r) => r.rating <= 2).length;
  const promoters = reviews.filter((r) => r.rating >= 4).length;
  const nps =
    totalReviews > 0
      ? Math.round(((promoters - detractors) / totalReviews) * 100)
      : 0;

  // --- Rating distribution ---
  const ratingDistribution = [1, 2, 3, 4, 5].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: totalReviews > 0
      ? Math.round((reviews.filter((r) => r.rating === star).length / totalReviews) * 100)
      : 0,
  }));

  // --- Reviews per day (last 30 days) ---
  const dailyMap = new Map<string, { count: number; sum: number }>();
  for (const r of recentReviews) {
    const day = r.created_at.slice(0, 10); // YYYY-MM-DD
    const entry = dailyMap.get(day) || { count: 0, sum: 0 };
    entry.count++;
    entry.sum += r.rating;
    dailyMap.set(day, entry);
  }

  // Fill missing days
  const dailyTrend: { date: string; count: number; avg: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    const entry = dailyMap.get(key);
    dailyTrend.push({
      date: key,
      count: entry?.count || 0,
      avg: entry ? Math.round((entry.sum / entry.count) * 10) / 10 : 0,
    });
  }

  // --- Wheel conversion rate ---
  const conversionRate =
    totalReviews > 0
      ? Math.round((totalParticipations / totalReviews) * 100)
      : 0;

  return (
    <PageTransition className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Statistiques</h1>
        <p className="text-muted-foreground mt-1">
          Donnees detaillees de votre restaurant
        </p>
      </div>

      <FadeIn delay={0.1}>
        <StatsCards
          totalReviews={totalReviews}
          avgRating={avgRating}
          totalParticipations={totalParticipations}
          totalPrizes={totalPrizes}
        />
      </FadeIn>

      <FadeIn delay={0.2}>
        <ReviewStats
          nps={nps}
          ratingDistribution={ratingDistribution}
          dailyTrend={dailyTrend}
          conversionRate={conversionRate}
          totalReviews={totalReviews}
          recentCount={recentReviews.length}
        />
      </FadeIn>
    </PageTransition>
  );
}
