import { getDashboardSession } from "@/shared/lib/dashboard-auth";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { redirect } from "next/navigation";
import { StatsCards } from "@/modules/avis/components/StatsCards";
import { DashboardQuickLinks } from "@/modules/menu/components/DashboardQuickLinks";
import { OnboardingChecklist } from "@/modules/admin/components/OnboardingChecklist";
import { PageTransition, FadeIn, AnimatedCounter } from "@/shared/components/animations";
import { getLabels } from "@/shared/lib/labels";
import type { EstablishmentType } from "@/shared/types";

export default async function DashboardPage() {
  const session = await getDashboardSession();
  if (!session) redirect("/dashboard/login");

  const restaurantId = session.restaurantId;

  // Fetch all stats in parallel
  const [reviewsRes, participationsRes, prizesRes, ordersRes, ordersTodayRes, restaurantRes, staffCountRes, tableCountRes, menuItemCountRes] = await Promise.all([
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
    supabaseAdmin
      .from("orders")
      .select("id, total_amount")
      .eq("restaurant_id", restaurantId),
    supabaseAdmin
      .from("orders")
      .select("id, total_amount")
      .eq("restaurant_id", restaurantId)
      .gte("created_at", new Date().toISOString().split("T")[0]),
    supabaseAdmin
      .from("restaurants")
      .select("slug, establishment_type, google_maps_url")
      .eq("id", restaurantId)
      .single(),
    supabaseAdmin
      .from("staff")
      .select("id", { count: "exact", head: true })
      .eq("restaurant_id", restaurantId),
    supabaseAdmin
      .from("restaurant_tables")
      .select("id", { count: "exact", head: true })
      .eq("restaurant_id", restaurantId),
    supabaseAdmin
      .from("menu_items")
      .select("id", { count: "exact", head: true })
      .eq("restaurant_id", restaurantId),
  ]);

  const reviews = reviewsRes.data || [];
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;
  const totalParticipations = participationsRes.data?.length || 0;
  const totalPrizes = prizesRes.data?.length || 0;

  const orders = ordersRes.data || [];
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const ordersToday = ordersTodayRes.data?.length || 0;
  const revenueToday = (ordersTodayRes.data || []).reduce((sum, o) => sum + (o.total_amount || 0), 0);

  const slug = restaurantRes.data?.slug || "";
  const establishmentType = (restaurantRes.data?.establishment_type || "restaurant") as EstablishmentType;
  const hasGoogleMapsUrl = !!restaurantRes.data?.google_maps_url;
  const etLabels = getLabels(establishmentType);
  const staffCount = staffCountRes.count ?? 0;
  const tableCount = tableCountRes.count ?? 0;
  const menuItemCount = menuItemCountRes.count ?? 0;

  return (
    <PageTransition className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Apercu</h1>
        <p className="text-muted-foreground mt-1">
          Vue d&apos;ensemble de votre {etLabels.establishment}
        </p>
      </div>

      {/* Onboarding checklist */}
      <OnboardingChecklist
        slug={slug}
        staffCount={staffCount}
        menuItemCount={menuItemCount}
        tableCount={tableCount}
        hasGoogleMapsUrl={hasGoogleMapsUrl}
        establishmentType={establishmentType}
      />

      {/* Stats Avis */}
      <FadeIn delay={0.1}>
        <StatsCards
          totalReviews={totalReviews}
          avgRating={avgRating}
          totalParticipations={totalParticipations}
          totalPrizes={totalPrizes}
        />
      </FadeIn>

      {/* Stats Commandes */}
      <FadeIn delay={0.2}>
        <div>
          <h2 className="text-lg font-semibold mb-3">Commandes</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-white shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-orange-600">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                  </svg>
                </div>
                <div>
                  <AnimatedCounter target={totalOrders} className="text-2xl font-bold" />
                  <p className="text-sm text-muted-foreground">Commandes totales</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-white shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-600">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div>
                  <AnimatedCounter target={Math.round(totalRevenue * 100) / 100} suffix={" \u20AC"} className="text-2xl font-bold" />
                  <p className="text-sm text-muted-foreground">CA total</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-white shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-50">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-sky-600">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <AnimatedCounter target={ordersToday} className="text-2xl font-bold" />
                  <p className="text-sm text-muted-foreground">Commandes aujourd&apos;hui</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-white shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-50">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-violet-600">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
                <div>
                  <AnimatedCounter target={Math.round(revenueToday * 100) / 100} suffix={" \u20AC"} className="text-2xl font-bold" />
                  <p className="text-sm text-muted-foreground">CA aujourd&apos;hui</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Liens rapides */}
      <FadeIn delay={0.3}>
        <DashboardQuickLinks slug={slug} establishmentType={establishmentType} />
      </FadeIn>
    </PageTransition>
  );
}
