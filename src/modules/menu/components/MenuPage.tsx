"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import type { Restaurant, MenuItem, MenuCategory, MenuItemWithCategory } from "@/shared/types";
import type { CartItem, CreateOrderResponse } from "@/modules/menu/types";
import MenuHeader from "./MenuHeader";
import CategoryNav from "./CategoryNav";
import MenuItemCard from "./MenuItemCard";
import CartBadge from "./CartBadge";
import CartDrawer from "./CartDrawer";
import CallWaiterButton from "./CallWaiterButton";
import TableSessionBanner from "./TableSessionBanner";
import { PageTransition, StaggerContainer, StaggerItem } from "@/shared/components/animations";

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

  // Table session state
  const [tableSessionId, setTableSessionId] = useState<string | null>(null);
  const [orderCount, setOrderCount] = useState(0);

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

  // Fetch order count for the current session
  const fetchOrderCount = useCallback(async (sessionId: string) => {
    try {
      const res = await fetch(
        `/api/menu/orders/by-session?table_session_id=${sessionId}&count_only=true`
      );
      if (res.ok) {
        const data = await res.json();
        setOrderCount(typeof data.count === "number" ? data.count : (Array.isArray(data) ? data.length : 0));
      }
    } catch {
      // Non-blocking
    }
  }, []);

  // --- Table Session Management ---
  useEffect(() => {
    async function initTableSession() {
      const storageKey = `table_session_${restaurant.slug}_${tableNumber}`;
      const storedSessionId = sessionStorage.getItem(storageKey);

      if (storedSessionId) {
        // Verify the stored session is still active
        try {
          const res = await fetch(
            `/api/menu/table-sessions?session_id=${storedSessionId}`
          );
          if (res.ok) {
            const session = await res.json();
            if (session && session.status === "active") {
              setTableSessionId(storedSessionId);
              // Fetch order count for this session
              fetchOrderCount(storedSessionId);
              return;
            }
          }
        } catch {
          // Session expired or not found, create new one
        }
        // Clear the expired session
        sessionStorage.removeItem(storageKey);
      }

      // Create a new table session
      try {
        const res = await fetch("/api/menu/table-sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            restaurant_id: restaurant.id,
            table_number: tableNumber,
          }),
        });

        if (res.ok) {
          const session = await res.json();
          setTableSessionId(session.id);
          sessionStorage.setItem(storageKey, session.id);
        }
      } catch {
        // Non-blocking: table session is optional, orders still work without it
      }
    }

    initTableSession();
  }, [restaurant.id, restaurant.slug, tableNumber, fetchOrderCount]);

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

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totalItems = cart.reduce((sum, c) => sum + c.quantity, 0);
  const totalPrice = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);

  // --- Cart timeout: clear after 15 minutes of inactivity ---
  const cartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [cartExpired, setCartExpired] = useState(false);

  useEffect(() => {
    if (cart.length === 0) {
      if (cartTimeoutRef.current) clearTimeout(cartTimeoutRef.current);
      setCartExpired(false);
      return;
    }

    if (cartTimeoutRef.current) clearTimeout(cartTimeoutRef.current);
    setCartExpired(false);

    cartTimeoutRef.current = setTimeout(() => {
      setCart([]);
      setIsCartOpen(false);
      setCartExpired(true);
      setTimeout(() => setCartExpired(false), 8000);
    }, 15 * 60 * 1000);

    return () => {
      if (cartTimeoutRef.current) clearTimeout(cartTimeoutRef.current);
    };
  }, [cart]);

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
          table_session_id: tableSessionId,
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

      // Update order count
      setOrderCount((prev) => prev + 1);

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
    <PageTransition className="min-h-dvh bg-gray-50">
      {/* En-tete sticky */}
      <MenuHeader restaurant={restaurant} tableNumber={tableNumber} />

      {/* Navigation categories sticky (sous le header) */}
      {!loading && categories.length > 0 && (
        <CategoryNav
          categories={categories}
          primaryColor={restaurant.primary_color}
        />
      )}

      {/* Table Session Banner - active orders indicator */}
      {orderCount > 0 && (
        <TableSessionBanner
          slug={restaurant.slug}
          tableNumber={tableNumber}
          orderCount={orderCount}
        />
      )}

      {/* Cart expired warning */}
      {cartExpired && (
        <div className="fixed top-4 inset-x-4 z-50 max-w-md mx-auto bg-amber-50 border border-amber-200 rounded-xl p-4 text-center shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-sm font-medium text-amber-800">Votre panier a expire apres 15 minutes d&apos;inactivite.</p>
          <p className="text-xs text-amber-600 mt-1">Ajoutez a nouveau vos articles pour commander.</p>
        </div>
      )}

      {/* Contenu principal */}
      <main className="max-w-2xl mx-auto px-4 py-6 pb-32">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-20 space-y-3">
            <p className="text-gray-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm underline text-blue-600"
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
              <StaggerContainer className="space-y-3">
                {catItems.map((item) => (
                  <StaggerItem key={item.id}>
                    <MenuItemCard
                      item={item}
                      quantity={getQuantity(item.id)}
                      onAdd={() => addToCart(item)}
                      onRemove={() => removeFromCart(item.id)}
                      isAvailable={item.is_available !== false}
                      categoryName={category.name}
                    />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </section>
          );
        })}
      </main>

      {/* Call Waiter FAB (bottom-left) */}
      <CallWaiterButton
        restaurantId={restaurant.id}
        tableNumber={tableNumber}
        tableSessionId={tableSessionId}
        establishmentType={restaurant.establishment_type}
      />

      {/* "Voir mes commandes" pill (above cart badge, bottom-right) — toujours visible */}
      <div className="fixed bottom-[88px] right-4 sm:right-6 z-50">
        <Link
          href={`/m/${restaurant.slug}/table/${tableNumber}/status`}
          className="flex items-center gap-1.5 bg-white border border-blue-200 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-full shadow-md hover:bg-blue-50 transition-colors"
        >
          <ClipboardList className="w-3.5 h-3.5" />
          Mes commandes{orderCount > 0 ? ` (${orderCount})` : ""}
        </Link>
      </div>

      {/* Badge panier flottant */}
      <CartBadge count={totalItems} onClick={() => setIsCartOpen(true)} />

      {/* Drawer panier (bottom sheet) */}
      <CartDrawer
        items={cart}
        onAdd={addToCart}
        onRemove={removeFromCart}
        onClear={clearCart}
        total={totalPrice}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrder={handleOrder}
        isSubmitting={isSubmitting}
        menuItems={items}
        tableNumber={tableNumber}
      />
    </PageTransition>
  );
}
