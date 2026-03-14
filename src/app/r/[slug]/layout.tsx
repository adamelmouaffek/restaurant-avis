import { supabaseAdmin } from "@/shared/lib/supabase/server";

export default async function ReviewLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const { data: restaurant } = await supabaseAdmin
    .from("restaurants")
    .select("establishment_type")
    .eq("slug", params.slug)
    .single();

  const et = restaurant?.establishment_type || "restaurant";

  return <div data-et={et}>{children}</div>;
}
