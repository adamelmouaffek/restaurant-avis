import { getDashboardSession } from "@/shared/lib/dashboard-auth";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { Sidebar } from "@/shared/components/Sidebar";

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

  // Fetch restaurant name
  const { data: restaurant } = await supabaseAdmin
    .from("restaurants")
    .select("name")
    .eq("id", session.restaurantId)
    .single();

  const restaurantName = restaurant?.name || "Restaurant";

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar restaurantName={restaurantName} />
      <main className="lg:pl-64">
        <div className="p-6 pt-16 lg:pt-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
