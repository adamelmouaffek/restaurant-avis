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
  created_at: string;
}
