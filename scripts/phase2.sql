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

-- Orders update policy (needed for server/KDS status changes)
DO $$ BEGIN
  CREATE POLICY "orders_update" ON orders FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Order items update policy (needed for KDS item checklist)
DO $$ BEGIN
  CREATE POLICY "order_items_update" ON order_items FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Staff insert/update/delete policies
DO $$ BEGIN
  CREATE POLICY "staff_insert" ON staff FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "staff_update" ON staff FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "staff_delete" ON staff FOR DELETE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Kitchen messages update for read_at
DO $$ BEGIN
  CREATE POLICY "kitchen_messages_update" ON kitchen_messages FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Restaurant tables update/insert/delete policies
DO $$ BEGIN
  CREATE POLICY "tables_insert" ON restaurant_tables FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "tables_update" ON restaurant_tables FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "tables_delete" ON restaurant_tables FOR DELETE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Trigger updated_at sur table_sessions
DROP TRIGGER IF EXISTS table_sessions_updated_at ON table_sessions;
CREATE TRIGGER table_sessions_updated_at
  BEFORE UPDATE ON table_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
