import { getDashboardSession } from "@/shared/lib/dashboard-auth";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { redirect } from "next/navigation";
import { StaffManager } from "@/modules/admin/components/StaffManager";

export default async function StaffPage() {
  const session = await getDashboardSession();
  if (!session) redirect("/dashboard/login");

  const { data: restaurant } = await supabaseAdmin
    .from("restaurants")
    .select("establishment_type")
    .eq("id", session.restaurantId)
    .single();

  return <StaffManager establishmentType={restaurant?.establishment_type || "restaurant"} />;
}
