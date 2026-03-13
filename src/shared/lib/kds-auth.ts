import { cookies } from "next/headers";
import { verifyJWT } from "./jwt";

export interface KdsSession {
  staffId: string;
  staffName: string;
  restaurantId: string;
  slug: string;
  role: string;
}

export async function getKdsSession(): Promise<KdsSession | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("kds_session");
  if (!session?.value) return null;

  try {
    return await verifyJWT<KdsSession>(session.value);
  } catch {
    return null;
  }
}
