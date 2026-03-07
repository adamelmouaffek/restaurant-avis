import { getDashboardSession } from "@/shared/lib/dashboard-auth";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { redirect } from "next/navigation";
import { QRCodeGenerator } from "@/modules/avis/components/QRCodeGenerator";

export default async function QRCodesPage() {
  const session = await getDashboardSession();
  if (!session) redirect("/dashboard/login");

  const { data: restaurant } = await supabaseAdmin
    .from("restaurants")
    .select("slug")
    .eq("id", session.restaurantId)
    .single();

  return (
    <QRCodeGenerator
      restaurantId={session.restaurantId}
      restaurantSlug={restaurant?.slug || ""}
    />
  );
}
