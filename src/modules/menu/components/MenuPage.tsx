"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Restaurant, MenuItem, MenuCategory, MenuItemWithCategory } from "@/shared/types";
import type { CartItem, CreateOrderResponse } from "@/modules/menu/types";
import MenuHeader from "./MenuHeader";
import CategoryNav from "./CategoryNav";
import MenuItemCard from "./MenuItemCard";
import CartBadge from "./CartBadge";
import CartDrawer from "./CartDrawer";

interface MenuPageProps {
  restaurant: Restaurant;
  tableNumber: string;
}

export default function MenuPage({ restaurant, tableNumber }: MenuPageProps) {
  const router = useRouter();

  // --- State ---
  const [items, setItems] = useState<MenuItemWithCategory[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Derives : categories uniques dans l'ordre de sort_order
  const categories: MenuCategory[] = (() => {
    const seen = new Set<string>();
    const result: MenuCategory[] = [];
    for (const item of items) {
      const cat = item.menu_categories;
      if (!seen.has(cat.id)) {
        seen.add(cat.id);
        // Reconstitue un objet MenuCategory minimal pour CategoryNav
        result.push({
          id: cat.id,
          name: cat.name,
          restaurant_id: restaurant.id,
          description: null,
          sort_order: 0,
          is_active: true,
          created_at: "",
        });
      }
    }
    return result;
  })();

  // --- Chargement des items depuis l'API ---
  useEffect(() => {
    async function fetchItems() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/menu/items?restaurant_id=${restaurant.id}`);
        if (!res.ok) throw new Error("Impossible de charger le menu");
        const data: MenuItemWithCategory[] = await res.json();
        // Filtre les items inactifs (mais garde les indisponibles pour afficher "Epuise")
        setItems(data.filter((i) => i.is_active));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, [restaurant.id]);

  // --- Fonctions panier ---
  const addToCart = useCallback((item: MenuItem & { is_available?: boolean }) => {
    if (item.is_available === false) return;
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === item.id);
      if (existing) {
        return prev.map((c) =>
          c.menuItemId === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [
        ...prev,
        {
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          notes: "",
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((menuItemId: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === menuItemId);
      if (!existing) return prev;
      if (existing.quantity === 1) {
        return prev.filter((c) => c.menuItemId !== menuItemId);
      }
      return prev.map((c) =>
        c.menuItemId === menuItemId ? { ...c, quantity: c.quantity - 1 } : c
      );
    });
  }, []);

  const getQuantity = useCallback(
    (menuItemId: string): number => {
      return cart.find((c) => c.menuItemId === menuItemId)?.quantity ?? 0;
    },
    [cart]
  );

  const totalItems = cart.reduce((sum, c) => sum + c.quantity, 0);
  const totalPrice = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);

  // --- Envoi de la commande ---
  const handleOrder = async (notes: string) => {
    if (cart.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/menu/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurant_id: restaurant.id,
          table_number: tableNumber,
          notes,
          items: cart.map((c) => ({
            menu_item_id: c.menuItemId,
            name: c.name,
            price: c.price,
            quantity: c.quantity,
            notes: c.notes,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Erreur lors de la commande");
      }

      const data: CreateOrderResponse = await res.json();

      // Vider le panier et fermer le drawer avant la redirection
      setCart([]);
      setIsCartOpen(false);

      router.push(
        `/m/${restaurant.slug}/confirmation?order_id=${data.orderId}&table_number=${data.tableNumber}&total=${data.totalAmount}`
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Une erreur est survenue. Veuillez reessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Grouper les items par categorie (pour l'affichage) ---
  const itemsByCategory: Record<string, MenuItemWithCategory[]> = {};
  for (const item of items) {
    const catId = item.menu_categories.id;
    if (!itemsByCategory[catId]) itemsByCategory[catId] = [];
    itemsByCategory[catId].push(item);
  }

  // --- Render ---
  return (
    <div className="min-h-dvh bg-gray-50">
      {/* En-tete sticky */}
      <MenuHeader restaurant={restaurant} tableNumber={tableNumber} />

      {/* Navigation categories sticky (sous le header) */}
      {!loading && categories.length > 0 && (
        <CategoryNav
          categories={categories}
          primaryColor={restaurant.primary_color}
        />
      )}

      {/* Contenu principal */}
      <main className="max-w-2xl mx-auto px-4 py-6 pb-32">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-gray-900 border-t-transparent animate-spin" />
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-20 space-y-3">
            <p className="text-gray-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm underline text-gray-700"
            >
              Recharger la page
            </button>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Aucun article disponible pour le moment.</p>
          </div>
        )}

        {!loading && !error && categories.map((category) => {
          const catItems = itemsByCategory[category.id] ?? [];
          if (catItems.length === 0) return null;

          return (
            <section
              key={category.id}
              id={`cat-${category.id}`}
              className="mb-8 scroll-mt-[136px]"
            >
              {/* Titre de la categorie */}
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                {category.name}
              </h2>

              {/* Liste des items */}
              <div className="space-y-3">
                {catItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    quantity={getQuantity(item.id)}
                    onAdd={() => addToCart(item)}
                    onRemove={() => removeFromCart(item.id)}
                    isAvailable={item.is_available !== false}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* Badge panier flottant */}
      <CartBadge count={totalItems} onClick={() => setIsCartOpen(true)} />

      {/* Drawer panier (bottom sheet) */}
      <CartDrawer
        items={cart}
        onAdd={addToCart}
        onRemove={removeFromCart}
        total={totalPrice}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrder={handleOrder}
        isSubmitting={isSubmitting}
        // Passe les items complets pour pouvoir retrouver le MenuItem depuis le CartItem
        menuItems={items}
      />
    </div>
  );
}
