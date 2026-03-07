import { cookies } from "next/headers";

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

    const decoded = Buffer.from(sessionCookie.value, "base64").toString("utf-8");
    const session = JSON.parse(decoded) as DashboardSession;

    if (!session.restaurantId || !session.email) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}
