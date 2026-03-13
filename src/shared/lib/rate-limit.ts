const store = new Map<string, { count: number; resetAt: number }>();
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;
  store.forEach((entry, key) => {
    if (now > entry.resetAt) store.delete(key);
  });
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number; resetAt: number } {
  cleanup();

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt };
  }

  entry.count++;
  if (entry.count > limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

// --- Account lockout: track failed PIN attempts per restaurant ---
const lockoutStore = new Map<string, { failures: number; lockedUntil: number }>();

export function checkLockout(restaurantId: string): { locked: boolean; remainingMs: number } {
  const key = `lockout:${restaurantId}`;
  const entry = lockoutStore.get(key);
  if (!entry) return { locked: false, remainingMs: 0 };
  const now = Date.now();
  if (now > entry.lockedUntil) {
    lockoutStore.delete(key);
    return { locked: false, remainingMs: 0 };
  }
  if (entry.failures >= 5) {
    return { locked: true, remainingMs: entry.lockedUntil - now };
  }
  return { locked: false, remainingMs: 0 };
}

export function recordFailedPin(restaurantId: string): void {
  const key = `lockout:${restaurantId}`;
  const entry = lockoutStore.get(key);
  const now = Date.now();
  if (!entry || now > entry.lockedUntil) {
    lockoutStore.set(key, { failures: 1, lockedUntil: now + 15 * 60 * 1000 });
    return;
  }
  entry.failures++;
  if (entry.failures >= 5) {
    entry.lockedUntil = now + 15 * 60 * 1000; // Lock for 15 minutes
  }
}

export function clearLockout(restaurantId: string): void {
  lockoutStore.delete(`lockout:${restaurantId}`);
}
