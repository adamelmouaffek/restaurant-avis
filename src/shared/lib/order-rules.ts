// ══════════════════════════════════════════════════════════════
// ORDER LIFECYCLE RULES — Source unique des regles metier
// ══════════════════════════════════════════════════════════════

export type OrderStatusValue =
  | "pending"
  | "confirmed"
  | "modification_requested"
  | "preparing"
  | "partially_ready"
  | "ready"
  | "delivered"
  | "awaiting_payment"
  | "paid"
  | "rejected"
  | "cancelled";

export type ActorRole = "client" | "server" | "kitchen" | "dashboard";

// ─── Terminal statuses (no further transitions) ─────────────
export const TERMINAL_STATUSES: OrderStatusValue[] = ["cancelled", "paid"];

// ─── Allowed transitions (regardless of role) ───────────────
export const ALLOWED_TRANSITIONS: Record<OrderStatusValue, OrderStatusValue[]> = {
  pending:                ["confirmed", "rejected", "cancelled"],
  confirmed:              ["preparing", "modification_requested", "rejected", "cancelled"],
  modification_requested: ["confirmed", "rejected", "cancelled"],
  preparing:              ["partially_ready", "ready"],
  partially_ready:        ["ready"],
  ready:                  ["delivered"],
  delivered:              ["awaiting_payment"],
  awaiting_payment:       ["paid"],
  rejected:               ["pending"],
  cancelled:              [],
  paid:                   [],
};

// ─── Role-based permissions ─────────────────────────────────
// Key format: "from->to"
// If a transition is in ALLOWED_TRANSITIONS but NOT in a role's set, that role cannot perform it.

const ROLE_ALLOWED: Record<ActorRole, Set<string>> = {
  client: new Set([
    "pending->cancelled",
  ]),

  kitchen: new Set([
    "pending->confirmed",
    "pending->rejected",
    "confirmed->preparing",
    "confirmed->rejected",
    "modification_requested->confirmed",
    "modification_requested->rejected",
    "preparing->partially_ready",
    "preparing->ready",
    "partially_ready->ready",
  ]),

  server: new Set([
    "pending->rejected",
    "pending->cancelled",
    "confirmed->modification_requested",
    "confirmed->rejected",
    "confirmed->cancelled",
    "modification_requested->cancelled",
    "ready->delivered",
    "delivered->awaiting_payment",
    "awaiting_payment->paid",
  ]),

  dashboard: new Set([
    "pending->confirmed",
    "pending->rejected",
    "pending->cancelled",
    "confirmed->modification_requested",
    "confirmed->rejected",
    "confirmed->cancelled",
    "modification_requested->confirmed",
    "modification_requested->rejected",
    "modification_requested->cancelled",
    "ready->delivered",
    "delivered->awaiting_payment",
    "awaiting_payment->paid",
    "rejected->pending",
  ]),
};

// ─── Core functions ─────────────────────────────────────────

/**
 * Check if a specific role can perform a transition.
 */
export function canTransition(
  from: OrderStatusValue,
  to: OrderStatusValue,
  role: ActorRole
): boolean {
  const allowed = ALLOWED_TRANSITIONS[from];
  if (!allowed || !allowed.includes(to)) return false;
  return ROLE_ALLOWED[role].has(`${from}->${to}`);
}

/**
 * Get the list of statuses a role can transition to from a given status.
 */
export function getNextStatuses(
  from: OrderStatusValue,
  role: ActorRole
): OrderStatusValue[] {
  const allowed = ALLOWED_TRANSITIONS[from] ?? [];
  return allowed.filter((to) => ROLE_ALLOWED[role].has(`${from}->${to}`));
}

/**
 * Validate a transition and return an error message if invalid.
 * Returns null if the transition is valid.
 */
export function validateTransition(
  from: OrderStatusValue,
  to: OrderStatusValue,
  role: ActorRole
): string | null {
  if (TERMINAL_STATUSES.includes(from)) {
    return `La commande est ${getStatusLabel(from)} — aucune modification possible.`;
  }

  const allowed = ALLOWED_TRANSITIONS[from];
  if (!allowed || !allowed.includes(to)) {
    return `Transition impossible : ${getStatusLabel(from)} → ${getStatusLabel(to)}.`;
  }

  if (!ROLE_ALLOWED[role].has(`${from}->${to}`)) {
    return `Vous n'avez pas la permission de passer de ${getStatusLabel(from)} a ${getStatusLabel(to)}.`;
  }

  return null;
}

// ─── Status labels & UI config ──────────────────────────────

export function getStatusLabel(status: OrderStatusValue): string {
  const labels: Record<OrderStatusValue, string> = {
    pending: "En attente",
    confirmed: "Confirmee",
    modification_requested: "Modification demandee",
    preparing: "En preparation",
    partially_ready: "Partiellement prete",
    ready: "Prete",
    delivered: "Servie",
    awaiting_payment: "En attente de paiement",
    paid: "Payee",
    rejected: "Refusee",
    cancelled: "Annulee",
  };
  return labels[status] ?? status;
}

export interface StatusUIConfig {
  label: string;
  color: string;
  bgColor: string;
}

export function getStatusUIConfig(status: OrderStatusValue): StatusUIConfig {
  const config: Record<OrderStatusValue, StatusUIConfig> = {
    pending: {
      label: "En attente",
      color: "text-yellow-700",
      bgColor: "bg-yellow-100 border-yellow-200",
    },
    confirmed: {
      label: "Confirmee",
      color: "text-blue-700",
      bgColor: "bg-blue-100 border-blue-200",
    },
    modification_requested: {
      label: "Modification",
      color: "text-purple-700",
      bgColor: "bg-purple-100 border-purple-200",
    },
    preparing: {
      label: "En preparation",
      color: "text-orange-700",
      bgColor: "bg-orange-100 border-orange-200",
    },
    partially_ready: {
      label: "Partiellement prete",
      color: "text-teal-700",
      bgColor: "bg-teal-100 border-teal-200",
    },
    ready: {
      label: "Prete !",
      color: "text-green-700",
      bgColor: "bg-green-100 border-green-200",
    },
    delivered: {
      label: "Servie",
      color: "text-gray-600",
      bgColor: "bg-gray-100 border-gray-200",
    },
    awaiting_payment: {
      label: "Attente paiement",
      color: "text-indigo-700",
      bgColor: "bg-indigo-100 border-indigo-200",
    },
    paid: {
      label: "Payee",
      color: "text-emerald-700",
      bgColor: "bg-emerald-100 border-emerald-200",
    },
    rejected: {
      label: "Refusee",
      color: "text-red-700",
      bgColor: "bg-red-100 border-red-200",
    },
    cancelled: {
      label: "Annulee",
      color: "text-red-700",
      bgColor: "bg-red-100 border-red-200",
    },
  };
  return config[status] ?? config.pending;
}
