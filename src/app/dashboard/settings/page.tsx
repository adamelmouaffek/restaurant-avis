import { getDashboardSession } from "@/shared/lib/dashboard-auth";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/modules/admin/components/SettingsForm";

export default async function SettingsPage() {
  const session = await getDashboardSession();
  if (!session) redirect("/dashboard/login");

  const { data: restaurant } = await supabaseAdmin
    .from("restaurants")
    .select("id, name, establishment_type, google_maps_url, logo_url, primary_color")
    .eq("id", session.restaurantId)
    .single();

  if (!restaurant) redirect("/dashboard/login");

  return <SettingsForm restaurant={restaurant} />;
}
