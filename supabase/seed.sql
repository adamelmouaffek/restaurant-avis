-- =============================================
-- Restaurant Avis — Seed Data (Demo)
-- A executer apres schema.sql
-- =============================================

-- Mot de passe demo : demo1234
-- Hash bcrypt genere avec 10 rounds
-- Tu devras regenerer ce hash avec ton propre bcrypt si necessaire

-- 1. Restaurant demo
INSERT INTO restaurants (id, name, slug, owner_email, owner_password_hash, google_maps_url, primary_color)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'La Belle Assiette',
  'la-belle-assiette',
  'demo@restaurant-avis.fr',
  '$2b$10$eoqYNOOSKgp8ARofEyIgpOfK.1CTJWp99pwQYjA3cR1ekh2LC/2zm',
  'https://maps.google.com/?cid=DEMO',
  '#E63946'
) ON CONFLICT (slug) DO NOTHING;

-- 2. Cadeaux (6 lots avec probabilites)
INSERT INTO prizes (restaurant_id, name, description, probability, color, icon, is_active) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Cafe Offert', 'Un cafe offert a presenter au serveur', 30, '#8B4513', '☕', true),
  ('11111111-1111-1111-1111-111111111111', 'Dessert Offert', 'Un dessert au choix offert', 15, '#FF69B4', '🍰', true),
  ('11111111-1111-1111-1111-111111111111', '-10% sur l''addition', 'Reduction de 10% sur votre prochaine visite', 20, '#4CAF50', '💰', true),
  ('11111111-1111-1111-1111-111111111111', 'Cocktail Offert', 'Un cocktail maison offert', 10, '#9C27B0', '🍹', true),
  ('11111111-1111-1111-1111-111111111111', 'Entree Offerte', 'Une entree au choix lors de votre prochaine visite', 15, '#FF9800', '🥗', true),
  ('11111111-1111-1111-1111-111111111111', 'Boisson Offerte', 'Un soft ou un verre de vin offert', 10, '#2196F3', '🥤', true);

-- 3. Participants et avis fictifs pour la demo
INSERT INTO participants (id, restaurant_id, email, name) VALUES
  ('aaaa0001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'marie.dupont@gmail.com', 'Marie Dupont'),
  ('aaaa0002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'jean.martin@gmail.com', 'Jean Martin'),
  ('aaaa0003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'sophie.bernard@gmail.com', 'Sophie Bernard'),
  ('aaaa0004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'lucas.petit@gmail.com', 'Lucas Petit'),
  ('aaaa0005-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'emma.robert@gmail.com', 'Emma Robert'),
  ('aaaa0006-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'thomas.durand@gmail.com', 'Thomas Durand'),
  ('aaaa0007-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'camille.moreau@gmail.com', 'Camille Moreau'),
  ('aaaa0008-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', 'hugo.simon@gmail.com', 'Hugo Simon'),
  ('aaaa0009-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111111', 'lea.laurent@gmail.com', 'Lea Laurent'),
  ('aaaa0010-0000-0000-0000-000000000010', '11111111-1111-1111-1111-111111111111', 'paul.lefebvre@gmail.com', 'Paul Lefebvre'),
  ('aaaa0011-0000-0000-0000-000000000011', '11111111-1111-1111-1111-111111111111', 'chloe.garcia@gmail.com', 'Chloe Garcia'),
  ('aaaa0012-0000-0000-0000-000000000012', '11111111-1111-1111-1111-111111111111', 'max.thomas@gmail.com', 'Maxime Thomas'),
  ('aaaa0013-0000-0000-0000-000000000013', '11111111-1111-1111-1111-111111111111', 'julie.richard@gmail.com', 'Julie Richard'),
  ('aaaa0014-0000-0000-0000-000000000014', '11111111-1111-1111-1111-111111111111', 'nico.blanc@gmail.com', 'Nicolas Blanc'),
  ('aaaa0015-0000-0000-0000-000000000015', '11111111-1111-1111-1111-111111111111', 'sarah.morel@gmail.com', 'Sarah Morel');

INSERT INTO reviews (restaurant_id, participant_id, rating, comment, created_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'aaaa0001-0000-0000-0000-000000000001', 5, 'Excellent restaurant ! Les plats sont delicieux et le service impeccable.', now() - interval '14 days'),
  ('11111111-1111-1111-1111-111111111111', 'aaaa0002-0000-0000-0000-000000000002', 4, 'Tres bonne cuisine, cadre agreable. Je recommande le risotto.', now() - interval '13 days'),
  ('11111111-1111-1111-1111-111111111111', 'aaaa0003-0000-0000-0000-000000000003', 5, 'Une vraie pepite ! On y retourne chaque semaine.', now() - interval '12 days'),
  ('11111111-1111-1111-1111-111111111111', 'aaaa0004-0000-0000-0000-000000000004', 3, 'Correct mais un peu bruyant le samedi soir. Cuisine bonne neanmoins.', now() - interval '11 days'),
  ('11111111-1111-1111-1111-111111111111', 'aaaa0005-0000-0000-0000-000000000005', 5, 'Le chef est un artiste ! Chaque plat est une oeuvre.', now() - interval '10 days'),
  ('11111111-1111-1111-1111-111111111111', 'aaaa0006-0000-0000-0000-000000000006', 4, 'Super brunch le dimanche. Les pancakes sont incroyables.', now() - interval '9 days'),
  ('11111111-1111-1111-1111-111111111111', 'aaaa0007-0000-0000-0000-000000000007', 5, 'Service rapide et souriant. Les desserts maison sont a tomber.', now() - interval '8 days'),
  ('11111111-1111-1111-1111-111111111111', 'aaaa0008-0000-0000-0000-000000000008', 4, 'Bon rapport qualite-prix. La carte des vins est bien fournie.', now() - interval '7 days'),
  ('11111111-1111-1111-1111-111111111111', 'aaaa0009-0000-0000-0000-000000000009', 5, 'Meilleur restaurant italien du quartier, sans hesiter !', now() - interval '6 days'),
  ('11111111-1111-1111-1111-111111111111', 'aaaa0010-0000-0000-0000-000000000010', 4, 'Ambiance chaleureuse et plats genereux. Parfait pour un diner en amoureux.', now() - interval '5 days'),
  ('11111111-1111-1111-1111-111111111111', 'aaaa0011-0000-0000-0000-000000000011', 5, 'J''adore ce restaurant ! Le tartare est exceptionnel.', now() - interval '4 days'),
  ('11111111-1111-1111-1111-111111111111', 'aaaa0012-0000-0000-0000-000000000012', 3, 'La cuisine est bonne mais l''attente etait longue ce soir-la.', now() - interval '3 days'),
  ('11111111-1111-1111-1111-111111111111', 'aaaa0013-0000-0000-0000-000000000013', 5, 'Coup de coeur ! La terrasse est magnifique en ete.', now() - interval '2 days'),
  ('11111111-1111-1111-1111-111111111111', 'aaaa0014-0000-0000-0000-000000000014', 4, 'Tres satisfait de notre repas d''anniversaire. Merci pour le gateau surprise !', now() - interval '1 day'),
  ('11111111-1111-1111-1111-111111111111', 'aaaa0015-0000-0000-0000-000000000015', 5, 'Un sans-faute du debut a la fin. On reviendra tres vite !', now());
