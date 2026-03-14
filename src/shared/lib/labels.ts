import type { EstablishmentType } from "@/shared/types";

export interface ThemeColors {
  bg: string;
  bg2: string;
  accent: string;
  accentLight: string;
  wheelC1: string;
  wheelC2: string;
  confetti: string[];
}

export interface EstablishmentLabels {
  table: string;
  tables: string;
  menu: string;
  waiter: string;
  waiterPlural: string;
  kitchen: string;
  serverSpace: string;
  kitchenScreen: string;
  establishment: string;
  establishmentLabel: string;
  defaultCategories: string[];
  staffLabel: string;
  showTo: string;
  theme: ThemeColors;
}

const LABELS: Record<EstablishmentType, EstablishmentLabels> = {
  restaurant: {
    table: "Table",
    tables: "Tables",
    menu: "Menu",
    waiter: "Serveur",
    waiterPlural: "Serveurs",
    kitchen: "Cuisine",
    serverSpace: "Espace Serveur",
    kitchenScreen: "Ecran cuisine",
    establishment: "restaurant",
    establishmentLabel: "Restaurant",
    defaultCategories: ["Entrees", "Plats", "Desserts"],
    staffLabel: "serveur",
    showTo: "au serveur",
    theme: {
      bg: "#0F172A", bg2: "#1E293B",
      accent: "#3B82F6", accentLight: "#60A5FA",
      wheelC1: "#1E40AF", wheelC2: "#60A5FA",
      confetti: ["#3B82F6", "#60A5FA", "#1D4ED8", "#818CF8", "#6366F1"],
    },
  },
  hotel: {
    table: "Chambre",
    tables: "Chambres",
    menu: "Room Service",
    waiter: "Service",
    waiterPlural: "Service",
    kitchen: "Cuisine",
    serverSpace: "Espace Service",
    kitchenScreen: "Ecran cuisine",
    establishment: "hotel",
    establishmentLabel: "Hotel",
    defaultCategories: ["Petit-dejeuner", "Dejeuner", "Diner", "Boissons"],
    staffLabel: "service",
    showTo: "au service",
    theme: {
      bg: "#0D0D0D", bg2: "#1C1917",
      accent: "#B8860B", accentLight: "#DAA520",
      wheelC1: "#8B6914", wheelC2: "#DAA520",
      confetti: ["#B8860B", "#DAA520", "#FFD700", "#C9A32E", "#8B6914"],
    },
  },
  cafe: {
    table: "Place",
    tables: "Places",
    menu: "Carte",
    waiter: "Barista",
    waiterPlural: "Baristas",
    kitchen: "Comptoir",
    serverSpace: "Espace Barista",
    kitchenScreen: "Ecran comptoir",
    establishment: "cafe",
    establishmentLabel: "Cafe",
    defaultCategories: ["Boissons chaudes", "Boissons froides", "Patisseries"],
    staffLabel: "barista",
    showTo: "au barista",
    theme: {
      bg: "#1A0A0F", bg2: "#2D1520",
      accent: "#9F1239", accentLight: "#E11D48",
      wheelC1: "#881337", wheelC2: "#E11D48",
      confetti: ["#9F1239", "#E11D48", "#F43F5E", "#BE123C", "#FB7185"],
    },
  },
  bar: {
    table: "Table",
    tables: "Tables",
    menu: "Carte",
    waiter: "Barman",
    waiterPlural: "Barmans",
    kitchen: "Bar",
    serverSpace: "Espace Barman",
    kitchenScreen: "Ecran bar",
    establishment: "bar",
    establishmentLabel: "Bar",
    defaultCategories: ["Cocktails", "Bieres", "Vins", "Planches"],
    staffLabel: "barman",
    showTo: "au barman",
    theme: {
      bg: "#0F0A20", bg2: "#1E1040",
      accent: "#7C3AED", accentLight: "#A78BFA",
      wheelC1: "#5B21B6", wheelC2: "#A78BFA",
      confetti: ["#7C3AED", "#A78BFA", "#8B5CF6", "#6D28D9", "#C4B5FD"],
    },
  },
};

export function getLabels(type: EstablishmentType = "restaurant"): EstablishmentLabels {
  return LABELS[type] || LABELS.restaurant;
}

// --- Demo data for optional seeding at registration ---

export interface DemoMenuItem {
  name: string;
  description: string;
  price: number;
  categoryIndex: number; // maps to defaultCategories[i]
}

export interface DemoPrize {
  name: string;
  description: string;
  probability: number;
  color: string;
  icon: string;
}

const DEMO_MENU_ITEMS: Record<EstablishmentType, DemoMenuItem[]> = {
  restaurant: [
    { name: "Salade Cesar", description: "Laitue romaine, parmesan, croutons, sauce cesar", price: 12.5, categoryIndex: 0 },
    { name: "Soupe a l'oignon", description: "Gratinee au fromage", price: 9, categoryIndex: 0 },
    { name: "Steak-frites", description: "Bavette 250g, frites maison, sauce au poivre", price: 22, categoryIndex: 1 },
    { name: "Saumon grille", description: "Filet de saumon, legumes de saison, riz basmati", price: 19.5, categoryIndex: 1 },
    { name: "Burger classique", description: "Boeuf 180g, cheddar, salade, tomate, oignon", price: 16, categoryIndex: 1 },
    { name: "Tiramisu", description: "Mascarpone, cafe, cacao", price: 8.5, categoryIndex: 2 },
    { name: "Creme brulee", description: "A la vanille de Madagascar", price: 7.5, categoryIndex: 2 },
  ],
  hotel: [
    { name: "Croissant beurre", description: "Croissant pur beurre artisanal", price: 3.5, categoryIndex: 0 },
    { name: "Oeufs Benedict", description: "Oeufs poches, sauce hollandaise, muffin anglais", price: 14, categoryIndex: 0 },
    { name: "Club sandwich", description: "Poulet, bacon, oeuf, salade, frites", price: 18, categoryIndex: 1 },
    { name: "Salade Nicoise", description: "Thon, oeuf, olives, haricots verts", price: 16, categoryIndex: 1 },
    { name: "Filet de boeuf", description: "Filet 200g, puree maison, jus reduit", price: 32, categoryIndex: 2 },
    { name: "Risotto aux champignons", description: "Champignons de saison, parmesan", price: 22, categoryIndex: 2 },
    { name: "Jus d'orange frais", description: "Orange pressee minute", price: 6, categoryIndex: 3 },
    { name: "Eau minerale", description: "Evian 50cl", price: 4, categoryIndex: 3 },
  ],
  cafe: [
    { name: "Espresso", description: "Cafe italien 100% arabica", price: 2.5, categoryIndex: 0 },
    { name: "Cappuccino", description: "Espresso, lait mousse, cacao", price: 4.5, categoryIndex: 0 },
    { name: "Latte Matcha", description: "The matcha, lait d'avoine", price: 5.5, categoryIndex: 0 },
    { name: "Jus de fruits frais", description: "Orange, pomme ou multifruits", price: 5, categoryIndex: 1 },
    { name: "Ice Tea maison", description: "The glace peche ou citron", price: 4.5, categoryIndex: 1 },
    { name: "Croissant aux amandes", description: "Croissant garni creme d'amande", price: 4, categoryIndex: 2 },
    { name: "Cookie chocolat", description: "Cookie geant aux pepites de chocolat", price: 3.5, categoryIndex: 2 },
  ],
  bar: [
    { name: "Mojito", description: "Rhum, menthe fraiche, citron vert, sucre de canne", price: 11, categoryIndex: 0 },
    { name: "Spritz", description: "Aperol, prosecco, eau gazeuse, orange", price: 10, categoryIndex: 0 },
    { name: "Margarita", description: "Tequila, triple sec, citron vert", price: 12, categoryIndex: 0 },
    { name: "IPA artisanale", description: "Biere IPA locale 33cl", price: 7, categoryIndex: 1 },
    { name: "Blonde pression", description: "Biere blonde 50cl", price: 6, categoryIndex: 1 },
    { name: "Cotes du Rhone", description: "Vin rouge, verre 15cl", price: 6.5, categoryIndex: 2 },
    { name: "Chardonnay", description: "Vin blanc, verre 15cl", price: 7, categoryIndex: 2 },
    { name: "Planche mixte", description: "Charcuterie, fromage, olives, pain", price: 16, categoryIndex: 3 },
    { name: "Planche fromage", description: "Selection de 5 fromages, confiture, noix", price: 14, categoryIndex: 3 },
  ],
};

const DEMO_PRIZES: Record<EstablishmentType, DemoPrize[]> = {
  restaurant: [
    { name: "Cafe Offert", description: "Un cafe offert a la fin du repas", probability: 30, color: "#8B4513", icon: "\u2615" },
    { name: "Dessert Offert", description: "Un dessert au choix offert", probability: 15, color: "#FF69B4", icon: "\uD83C\uDF70" },
    { name: "-10% sur l'addition", description: "10% de reduction sur votre addition", probability: 20, color: "#4CAF50", icon: "\uD83D\uDCB0" },
    { name: "Cocktail Offert", description: "Un cocktail maison offert", probability: 10, color: "#9C27B0", icon: "\uD83C\uDF79" },
    { name: "Entree Offerte", description: "Une entree au choix offerte", probability: 15, color: "#FF9800", icon: "\uD83E\uDD57" },
    { name: "Boisson Offerte", description: "Une boisson soft offerte", probability: 10, color: "#2196F3", icon: "\uD83E\uDD64" },
  ],
  hotel: [
    { name: "Petit-dejeuner Offert", description: "Petit-dejeuner en chambre offert", probability: 20, color: "#FF9800", icon: "\uD83E\uDD50" },
    { name: "Late Checkout", description: "Depart retarde a 14h", probability: 25, color: "#9C27B0", icon: "\uD83D\uDD50" },
    { name: "-15% Room Service", description: "15% sur votre prochaine commande room service", probability: 20, color: "#4CAF50", icon: "\uD83D\uDCB0" },
    { name: "Boisson de bienvenue", description: "Boisson offerte au bar de l'hotel", probability: 25, color: "#2196F3", icon: "\uD83C\uDF7E" },
    { name: "Surclassement", description: "Surclassement sous reserve de disponibilite", probability: 10, color: "#FFD700", icon: "\u2B50" },
  ],
  cafe: [
    { name: "Boisson chaude Offerte", description: "Un cafe ou the offert", probability: 30, color: "#8B4513", icon: "\u2615" },
    { name: "Patisserie Offerte", description: "Une patisserie au choix", probability: 20, color: "#FF69B4", icon: "\uD83E\uDDC1" },
    { name: "-10% sur la note", description: "10% de reduction", probability: 20, color: "#4CAF50", icon: "\uD83D\uDCB0" },
    { name: "Smoothie Offert", description: "Un smoothie du jour offert", probability: 15, color: "#FF9800", icon: "\uD83E\uDD64" },
    { name: "Formule + Offerte", description: "Passage gratuit en formule superieure", probability: 15, color: "#9C27B0", icon: "\u2B50" },
  ],
  bar: [
    { name: "Shot Offert", description: "Un shot au choix offert", probability: 25, color: "#FF9800", icon: "\uD83E\uDD43" },
    { name: "Cocktail Offert", description: "Un cocktail maison offert", probability: 15, color: "#9C27B0", icon: "\uD83C\uDF79" },
    { name: "-10% sur l'addition", description: "10% de reduction", probability: 20, color: "#4CAF50", icon: "\uD83D\uDCB0" },
    { name: "Planche Offerte", description: "Une planche a partager offerte", probability: 15, color: "#FF69B4", icon: "\uD83E\uDDC0" },
    { name: "Biere Offerte", description: "Une biere pression offerte", probability: 25, color: "#2196F3", icon: "\uD83C\uDF7A" },
  ],
};

export function getDemoMenuItems(type: EstablishmentType = "restaurant"): DemoMenuItem[] {
  return DEMO_MENU_ITEMS[type] || DEMO_MENU_ITEMS.restaurant;
}

export function getDemoPrizes(type: EstablishmentType = "restaurant"): DemoPrize[] {
  return DEMO_PRIZES[type] || DEMO_PRIZES.restaurant;
}
