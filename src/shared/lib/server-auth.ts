import { cookies } from "next/headers";
import { verifyJWT } from "./jwt";

export interface ServerSession {
  staffId: string;
  staffName: string;
  restaurantId: string;
  slug: string;
  role: "waiter" | "manager" | "kitchen";
}

export async function getServerSession(): Promise<ServerSession | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("server_session");
  if (!session?.value) return null;

  try {
    return await verifyJWT<ServerSession>(session.value);
  } catch {
    return null;
  }
}
