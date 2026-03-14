export type EstablishmentType = "restaurant" | "hotel" | "cafe" | "bar";

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  owner_email: string;
  owner_password_hash: string;
  google_maps_url: string | null;
  google_place_id: string | null;
  logo_url: string | null;
  primary_color: string;
  establishment_type: EstablishmentType;
  created_at: string;
}

export interface Prize {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  probability: number;
  color: string;
  icon: string;
  is_active: boolean;
  created_at: string;
}

export interface Participant {
  id: string;
  restaurant_id: string;
  email: string;
  name: string | null;
  google_sub: string | null;
  phone: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  restaurant_id: string;
  participant_id: string;
  rating: number | null;
  comment: string | null;
  google_maps_flow?: boolean;
  google_review_trust?: string;
  google_maps_departure_at?: string;
  google_maps_return_at?: string;
  created_at: string;
}

export interface Participation {
  id: string;
  participant_id: string;
  restaurant_id: string;
  review_id: string;
  prize_id: string;
  prize_name: string;
  claimed: boolean;
  created_at: string;
}

export interface QRCode {
  id: string;
  restaurant_id: string;
  table_number: string;
  url: string;
  type: "avis" | "menu";
  created_at: string;
}

// ==================== MODULE MENU ====================

export interface RestaurantTable {
  id: string;
  restaurant_id: string;
  number: string;
  capacity: number | null;
  is_active: boolean;
  position_x: number;
  position_y: number;
  shape: "square" | "round" | "rectangle";
  created_at: string;
}

export interface MenuCategory {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  allergens: string[];
  is_available: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface MenuItemWithCategory extends MenuItem {
  menu_categories: Pick<MenuCategory, "id" | "name">;
}

export type OrderStatus =
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

export interface Order {
  id: string;
  restaurant_id: string;
  table_number: string;
  status: OrderStatus;
  notes: string | null;
  total_amount: number;
  payment_method: "server" | "stripe";
  table_session_id: string | null;
  source: "client" | "waiter";
  priority: "normal" | "rush" | "vip";
  staff_id: string | null;
  estimated_prep_minutes: number | null;
  rejection_reason: string | null;
  paid: boolean;
  discount_amount: number;
  discount_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
  notes: string | null;
  item_status: "pending" | "preparing" | "done";
  created_at: string;
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

// ==================== PHASE 2 : Serveur/Client/Cuisine ====================

export interface TableSession {
  id: string;
  restaurant_id: string;
  table_number: string;
  status: "active" | "requesting_bill" | "paid" | "closed";
  opened_at: string;
  closed_at: string | null;
  created_at: string;
}

export interface ServiceRequest {
  id: string;
  restaurant_id: string;
  table_number: string;
  table_session_id: string | null;
  type: "call_waiter" | "request_bill";
  status: "pending" | "acknowledged" | "resolved";
  created_at: string;
  resolved_at: string | null;
}

export interface Staff {
  id: string;
  restaurant_id: string;
  name: string;
  pin: string;
  role: "waiter" | "manager" | "kitchen";
  is_active: boolean;
  created_at: string;
}

export interface KitchenMessage {
  id: string;
  restaurant_id: string;
  order_id: string | null;
  direction: "to_kitchen" | "from_kitchen";
  message: string;
  sender_name: string | null;
  read_at: string | null;
  created_at: string;
}

export type TableStatus =
  | "empty"
  | "occupied"
  | "ordering"
  | "waiting_food"
  | "eating"
  | "requesting_bill"
  | "calling_waiter";
