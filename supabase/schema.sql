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

-- Index pour les requetes frequentes
CREATE INDEX IF NOT EXISTS idx_prizes_restaurant ON prizes(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_participants_restaurant ON participants(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_reviews_restaurant ON reviews(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_participations_restaurant ON participations(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON restaurants(slug);
