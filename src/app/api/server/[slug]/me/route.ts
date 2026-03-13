import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/shared/lib/server-auth";

export const dynamic = "force-dynamic";

// GET: Return current server session info (used by client layout to check auth)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }

  const { slug } = await params;
  if (session.slug !== slug) {
    return NextResponse.json({ error: "Session invalide" }, { status: 401 });
  }

  return NextResponse.json({
    staffId: session.staffId,
    staffName: session.staffName,
    restaurantId: session.restaurantId,
    slug: session.slug,
    role: session.role,
  });
}
