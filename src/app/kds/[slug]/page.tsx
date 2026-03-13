import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { getKdsSession } from "@/shared/lib/kds-auth";
import { KDSBoard } from "@/modules/menu/components/KDSBoard";

interface KDSPageProps {
  params: { slug: string };
}

export default async function KDSPage({ params }: KDSPageProps) {
  const { slug } = params;

  // Check KDS session
  const session = await getKdsSession();
  if (!session || session.slug !== slug) {
    redirect(`/kds/${slug}/login`);
  }

  const { data: restaurant, error } = await supabaseAdmin
    .from("restaurants")
    .select("id, name, slug")
    .eq("slug", slug)
    .single();

  if (error || !restaurant) {
    redirect("/");
  }

  return (
    <KDSBoard
      restaurantId={restaurant.id}
      restaurantName={restaurant.name}
      restaurantSlug={slug}
    />
  );
}
