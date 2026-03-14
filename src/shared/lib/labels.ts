import type { EstablishmentType } from "@/shared/types";

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
  },
};

export function getLabels(type: EstablishmentType = "restaurant"): EstablishmentLabels {
  return LABELS[type] || LABELS.restaurant;
}
