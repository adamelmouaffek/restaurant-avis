// Utilitaires pour gerer la session Google Maps dans sessionStorage
// Persiste l'etat du flow entre la navigation vers Google Maps et le retour
// SECURITE: ne stocke PAS de PII (email, googleSub) — seulement des IDs et timestamps

const STORAGE_KEY_PREFIX = "gmaps_session_";

export interface GoogleMapsSession {
  slug: string;
  sessionToken: string;
  departureTimestamp: number;
  googleMapsUrl: string;
  restaurantId: string;
  attempts: number;
}

export function startSession(data: {
  slug: string;
  googleMapsUrl: string;
  restaurantId: string;
}): void {
  const session: GoogleMapsSession = {
    ...data,
    sessionToken: crypto.randomUUID(),
    departureTimestamp: Date.now(),
    attempts: 1,
  };
  sessionStorage.setItem(
    STORAGE_KEY_PREFIX + data.slug,
    JSON.stringify(session)
  );
}

export function getSession(slug: string): GoogleMapsSession | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_PREFIX + slug);
    if (!raw) return null;
    return JSON.parse(raw) as GoogleMapsSession;
  } catch {
    return null;
  }
}

export function recordDeparture(slug: string): void {
  const session = getSession(slug);
  if (!session) return;
  session.departureTimestamp = Date.now();
  session.attempts += 1;
  sessionStorage.setItem(STORAGE_KEY_PREFIX + slug, JSON.stringify(session));
}

export function clearSession(slug: string): void {
  sessionStorage.removeItem(STORAGE_KEY_PREFIX + slug);
}

export function calculateTrustLevel(
  departureMs: number,
  returnMs: number
): "low" | "medium" | "high" {
  const deltaSeconds = (returnMs - departureMs) / 1000;
  if (deltaSeconds < 15) return "low";
  if (deltaSeconds < 60) return "medium";
  return "high";
}
