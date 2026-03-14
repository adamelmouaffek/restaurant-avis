export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes: string;
}

export interface CreateOrderPayload {
  restaurant_id: string;
  table_number: string;
  notes: string;
  items: Array<{
    menu_item_id: string;
    name: string;
    price: number;
    quantity: number;
    notes: string;
  }>;
}

export interface CreateOrderResponse {
  orderId: string;
  tableNumber: string;
  totalAmount: number;
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  modification_requested: "Modification",
  preparing: "En préparation",
  partially_ready: "Partiellement prête",
  ready: "Prête",
  delivered: "Servie",
  awaiting_payment: "Attente paiement",
  paid: "Payée",
  cancelled: "Annulée",
  rejected: "Refusée",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  modification_requested: "bg-amber-100 text-amber-800",
  preparing: "bg-orange-100 text-orange-800",
  partially_ready: "bg-lime-100 text-lime-800",
  ready: "bg-green-100 text-green-800",
  delivered: "bg-gray-100 text-gray-800",
  awaiting_payment: "bg-indigo-100 text-indigo-800",
  paid: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
  rejected: "bg-red-100 text-red-800",
};

export const ALLERGENS_EU = [
  "Gluten",
  "Lactose",
  "Oeufs",
  "Poisson",
  "Crustacés",
  "Noix",
  "Arachides",
  "Soja",
  "Sésame",
  "Céleri",
  "Moutarde",
  "Lupin",
  "Mollusques",
  "Sulfites",
] as const;
