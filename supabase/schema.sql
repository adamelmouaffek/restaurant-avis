-- =============================================
-- Restaurant Avis — Schema DB
-- A executer dans le SQL Editor de Supabase
-- =============================================

-- 1. Table restaurants (tenant principal)
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_email TEXT NOT NULL,
  owner_password_hash TEXT NOT NULL,
  google_maps_url TEXT,
  google_place_id TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#E63946',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Table prizes (cadeaux configurables)
CREATE TABLE IF NOT EXISTS prizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  probability INTEGER NOT NULL DEFAULT 10,
  color TEXT DEFAULT '#FFD700',
  icon TEXT DEFAULT '🎁',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Table participants (anti-abus)
CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  google_sub TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(restaurant_id, email)
);

-- 4. Table reviews (avis soumis)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES participants(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Table participations (resultats de la roue)
CREATE TABLE IF NOT EXISTS participations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES participants(id),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  review_id UUID REFERENCES reviews(id),
  prize_id UUID REFERENCES prizes(id),
  prize_name TEXT NOT NULL,
  claimed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Table qr_codes (codes QR generes)
CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  table_number TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Colonne type sur qr_codes (avis vs menu)
ALTER TABLE qr_codes ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'avis'
  CHECK (type IN ('avis', 'menu'));

-- Index pour les requetes frequentes
CREATE INDEX IF NOT EXISTS idx_prizes_restaurant ON prizes(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_participants_restaurant ON participants(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_reviews_restaurant ON reviews(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_participations_restaurant ON participations(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON restaurants(slug);

-- =============================================
-- MODULE MENU — 5 nouvelles tables
-- =============================================

-- 7. Tables du restaurant
CREATE TABLE IF NOT EXISTS restaurant_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  number TEXT NOT NULL,
  capacity INT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(restaurant_id, number)
);

-- 8. Categories du menu
CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Articles du menu
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  allergens TEXT[] DEFAULT '{}',
  is_available BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Commandes
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  table_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','confirmed','preparing','ready','delivered','cancelled')),
  notes TEXT,
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'server',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Lignes de commande
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id),
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index module menu
CREATE INDEX IF NOT EXISTS idx_orders_restaurant ON orders(restaurant_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_restaurant_tables ON restaurant_tables(restaurant_id);

-- Trigger updated_at sur orders (indispensable pour Supabase Realtime)
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS (necessaire pour subscriptions Realtime cote client anon)
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_tables ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "menu_categories_read" ON menu_categories;
DROP POLICY IF EXISTS "menu_items_read" ON menu_items;
DROP POLICY IF EXISTS "orders_read" ON orders;
DROP POLICY IF EXISTS "orders_insert" ON orders;
DROP POLICY IF EXISTS "order_items_read" ON order_items;
DROP POLICY IF EXISTS "order_items_insert" ON order_items;
DROP POLICY IF EXISTS "tables_read" ON restaurant_tables;

CREATE POLICY "menu_categories_read" ON menu_categories FOR SELECT USING (true);
CREATE POLICY "menu_items_read" ON menu_items FOR SELECT USING (true);
CREATE POLICY "orders_read" ON orders FOR SELECT USING (true);
CREATE POLICY "orders_insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "order_items_read" ON order_items FOR SELECT USING (true);
CREATE POLICY "order_items_insert" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "tables_read" ON restaurant_tables FOR SELECT USING (true);

-- =============================================
-- PHASE 2 : Interfaces Serveur/Client/Cuisine
-- =============================================

-- 12. Sessions de table (groupe les commandes d'une visite)
CREATE TABLE IF NOT EXISTS table_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  table_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active','requesting_bill','paid','closed')),
  opened_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_table_sessions_active ON table_sessions(restaurant_id, table_number, status);

-- 13. Demandes de service (appel serveur, addition)
CREATE TABLE IF NOT EXISTS service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  table_number TEXT NOT NULL,
  table_session_id UUID REFERENCES table_sessions(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('call_waiter','request_bill')),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','acknowledged','resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_service_requests_active ON service_requests(restaurant_id, status);

-- 14. Staff (serveurs avec PIN)
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  pin TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'waiter'
    CHECK (role IN ('waiter','manager','kitchen')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(restaurant_id, pin)
);

-- 15. Messages cuisine <-> serveur
CREATE TABLE IF NOT EXISTS kitchen_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  direction TEXT NOT NULL CHECK (direction IN ('to_kitchen','from_kitchen')),
  message TEXT NOT NULL,
  sender_name TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Colonnes supplementaires sur orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS table_session_id UUID REFERENCES table_sessions(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'client';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS staff_id UUID;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS estimated_prep_minutes INT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_reason TEXT;

-- Mettre a jour le CHECK constraint de status pour inclure 'rejected'
-- Note: DROP IF EXISTS ne marche pas sur toutes les versions, on wrappe dans un DO block
DO $$ BEGIN
  ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
  ALTER TABLE orders ADD CONSTRAINT orders_status_check
    CHECK (status IN ('pending','confirmed','preparing','ready','delivered','cancelled','rejected'));
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Colonne item_status sur order_items
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS item_status TEXT DEFAULT 'pending';

-- Colonnes position sur restaurant_tables
ALTER TABLE restaurant_tables ADD COLUMN IF NOT EXISTS position_x INT DEFAULT 0;
ALTER TABLE restaurant_tables ADD COLUMN IF NOT EXISTS position_y INT DEFAULT 0;
ALTER TABLE restaurant_tables ADD COLUMN IF NOT EXISTS shape TEXT DEFAULT 'square';

-- RLS pour nouvelles tables
ALTER TABLE table_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE kitchen_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "table_sessions_read" ON table_sessions FOR SELECT USING (true);
CREATE POLICY "table_sessions_insert" ON table_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "table_sessions_update" ON table_sessions FOR UPDATE USING (true);
CREATE POLICY "service_requests_read" ON service_requests FOR SELECT USING (true);
CREATE POLICY "service_requests_insert" ON service_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "service_requests_update" ON service_requests FOR UPDATE USING (true);
CREATE POLICY "staff_read" ON staff FOR SELECT USING (true);
CREATE POLICY "staff_all" ON staff FOR ALL USING (true);
CREATE POLICY "kitchen_messages_read" ON kitchen_messages FOR SELECT USING (true);
CREATE POLICY "kitchen_messages_insert" ON kitchen_messages FOR INSERT WITH CHECK (true);

-- Trigger updated_at sur table_sessions
DROP TRIGGER IF EXISTS table_sessions_updated_at ON table_sessions;
CREATE TRIGGER table_sessions_updated_at
  BEFORE UPDATE ON table_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
