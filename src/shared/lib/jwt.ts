import { SignJWT, jwtVerify } from "jose";

const getSecret = () => {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET is not set");
  return new TextEncoder().encode(secret);
};

export async function signJWT(
  payload: Record<string, unknown>,
  expiresIn: string
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret());
}

export async function verifyJWT<T = Record<string, unknown>>(
  token: string
): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as T;
  } catch {
    return null;
  }
}
