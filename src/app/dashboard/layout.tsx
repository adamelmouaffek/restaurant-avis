import type { Metadata } from "next";
import { getDashboardSession } from "@/shared/lib/dashboard-auth";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { Sidebar } from "@/shared/components/Sidebar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getDashboardSession();

  // If no session (login page), render without sidebar
  if (!session) {
    return <>{children}</>;
  }

  // Fetch restaurant name + type
  const { data: restaurant } = await supabaseAdmin
    .from("restaurants")
    .select("name, establishment_type")
    .eq("id", session.restaurantId)
    .single();

  const restaurantName = restaurant?.name || "Restaurant";
  const establishmentType = restaurant?.establishment_type || "restaurant";

  return (
    <div className="min-h-screen bg-muted/30" data-et={establishmentType}>
      <Sidebar restaurantName={restaurantName} establishmentType={establishmentType} />
      <main className="lg:pl-64">
        <div className="p-6 pt-16 lg:pt-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
