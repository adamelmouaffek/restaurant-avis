import { cookies } from "next/headers";
import { verifyJWT } from "./jwt";

export interface DashboardSession {
  restaurantId: string;
  email: string;
}

export async function getDashboardSession(): Promise<DashboardSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("dashboard_session");

    if (!sessionCookie?.value) {
      return null;
    }

    const session = await verifyJWT<DashboardSession>(sessionCookie.value);

    if (!session?.restaurantId || !session?.email) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}
