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
  rating: number;
  comment: string | null;
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
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  restaurant_id: string;
  table_number: string;
  status: OrderStatus;
  notes: string | null;
  total_amount: number;
  payment_method: "server" | "stripe";
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
  created_at: string;
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}
