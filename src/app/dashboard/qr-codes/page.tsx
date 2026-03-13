import { getDashboardSession } from "@/shared/lib/dashboard-auth";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { redirect } from "next/navigation";
import { QRCodeGenerator } from "@/modules/avis/components/QRCodeGenerator";
import { MenuQRGenerator } from "@/modules/menu/components/MenuQRGenerator";
import { PageTransition, FadeIn } from "@/shared/components/animations";

export default async function QRCodesPage() {
  const session = await getDashboardSession();
  if (!session) redirect("/dashboard/login");

  const { data: restaurant } = await supabaseAdmin
    .from("restaurants")
    .select("slug")
    .eq("id", session.restaurantId)
    .single();

  const slug = restaurant?.slug || "";

  return (
    <PageTransition className="space-y-10">
      {/* Section Menu QR */}
      <FadeIn delay={0.1}>
        <MenuQRGenerator restaurantSlug={slug} />
      </FadeIn>

      {/* Separateur */}
      <hr className="border-border" />

      {/* Section Avis QR (existant) */}
      <FadeIn delay={0.2}>
        <QRCodeGenerator restaurantId={session.restaurantId} restaurantSlug={slug} />
      </FadeIn>
    </PageTransition>
  );
}
