"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  Send,
  StickyNote,
  Flame,
  Star,
} from "lucide-react";
import Image from "next/image";
import type { MenuCategory, MenuItem, MenuItemWithCategory } from "@/shared/types";

interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes: string;
}

interface TakeOrderViewProps {
  slug: string;
  tableNumber: string;
  tableSessionId: string | null;
}

export default function TakeOrderView({
  slug,
  tableNumber,
  tableSessionId: initialSessionId,
}: TakeOrderViewProps) {
  const router = useRouter();

  const [items, setItems] = useState<MenuItemWithCategory[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");
  const [priority, setPriority] = useState<"normal" | "rush" | "vip">("normal");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(initialSessionId);

  // Fetch menu items + resolve table session
  useEffect(() => {
    async function fetchMenu() {
      try {
        setLoading(true);
        // Fetch tables to get restaurant_id and session info for this table
        const tablesRes = await fetch(`/api/server/${slug}/tables`);
        if (!tablesRes.ok) throw new Error("Impossible de charger les tables");
        const tables = await tablesRes.json();
        if (tables.length === 0) throw new Error("Aucune table trouvee");

        // Get restaurant_id from the first table
        const restaurantId = tables[0].restaurant_id;

        // Find the specific table to get its session
        const thisTable = tables.find(
          (t: { number: string }) => t.number === tableNumber
        );
        if (thisTable?.session?.id && !sessionId) {
          setSessionId(thisTable.session.id);
        }

        const res = await fetch(`/api/menu/items?restaurant_id=${restaurantId}`);
        if (!res.ok) throw new Error("Impossible de charger le menu");
        const data: MenuItemWithCategory[] = await res.json();
        setItems(data.filter((i) => i.is_active));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, tableNumber]);

  // Derive categories
  const categories: MenuCategory[] = (() => {
    const seen = new Set<string>();
    const result: MenuCategory[] = [];
    for (const item of items) {
      const cat = item.menu_categories;
      if (!seen.has(cat.id)) {
        seen.add(cat.id);
        result.push({
          id: cat.id,
          name: cat.name,
          restaurant_id: item.restaurant_id,
          description: null,
          sort_order: 0,
          is_active: true,
          created_at: "",
        });
      }
    }
    return result;
  })();

  // Set initial active category
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  // Filter items
  const filteredItems = items.filter((item) => {
    if (searchQuery) {
      return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (activeCategory) {
      return item.menu_categories.id === activeCategory;
    }
    return true;
  });

  // Cart functions
  const addToCart = useCallback((item: MenuItem) => {
    if (!item.is_available) return;
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === item.id);
      if (existing) {
        return prev.map((c) =>
          c.menuItemId === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [
        ...prev,
        { menuItemId: item.id, name: item.name, price: item.price, quantity: 1, notes: "" },
      ];
    });
  }, []);

  const removeFromCart = useCallback((menuItemId: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === menuItemId);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter((c) => c.menuItemId !== menuItemId);
      }
      return prev.map((c) =>
        c.menuItemId === menuItemId ? { ...c, quantity: c.quantity - 1 } : c
      );
    });
  }, []);

  const removeItemCompletely = useCallback((menuItemId: string) => {
    setCart((prev) => prev.filter((c) => c.menuItemId !== menuItemId));
  }, []);

  const getQuantity = useCallback(
    (menuItemId: string): number => {
      return cart.find((c) => c.menuItemId === menuItemId)?.quantity ?? 0;
    },
    [cart]
  );

  const totalItems = cart.reduce((sum, c) => sum + c.quantity, 0);
  const totalPrice = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);

  // Submit order
  const handleSubmit = async () => {
    if (cart.length === 0 || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/server/${slug}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table_number: tableNumber,
          table_session_id: sessionId,
          notes: orderNotes || null,
          priority,
          items: cart.map((c) => ({
            menu_item_id: c.menuItemId,
            quantity: c.quantity,
            notes: c.notes || null,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Erreur lors de la commande");
      }

      // Success - go back to tables
      router.push(`/s/${slug}/tables`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <p className="text-gray-500 mb-3">{error}</p>
        <button
          onClick={() => router.back()}
          className="text-blue-600 font-medium text-sm"
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-[#0F172A] text-white px-4 py-3 flex items-center gap-3 sticky top-0 z-40">
        <button
          onClick={() => router.back()}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-base font-bold">Nouvelle commande</h1>
          <p className="text-xs text-blue-300">Table {tableNumber}</p>
        </div>
        {/* Priority toggle */}
        <div className="flex gap-1">
          <button
            onClick={() => setPriority((p) => (p === "rush" ? "normal" : "rush"))}
            className={`p-2 rounded-lg transition-colors ${
              priority === "rush" ? "bg-orange-500 text-white" : "text-gray-400 hover:bg-white/10"
            }`}
            title="Urgent"
          >
            <Flame className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPriority((p) => (p === "vip" ? "normal" : "vip"))}
            className={`p-2 rounded-lg transition-colors ${
              priority === "vip" ? "bg-purple-500 text-white" : "text-gray-400 hover:bg-white/10"
            }`}
            title="VIP"
          >
            <Star className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Search bar */}
      <div className="px-4 py-2 bg-white border-b border-gray-100">
        <input
          type="search"
          placeholder="Rechercher un article..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-9 px-3 rounded-lg bg-gray-100 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
      </div>

      {/* Category nav */}
      {!searchQuery && categories.length > 0 && (
        <nav className="bg-white border-b border-gray-100 sticky top-[60px] z-30">
          <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 h-8 px-4 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  cat.id === activeCategory
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* Menu items */}
      <div className="flex-1 p-4 pb-32 space-y-2">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>Aucun article trouve</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const qty = getQuantity(item.id);
            const isAvailable = item.is_available !== false;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm ${
                  !isAvailable ? "opacity-50" : ""
                }`}
              >
                {/* Image */}
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl">🍽</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {item.name}
                  </h3>
                  <p className="text-sm font-bold text-gray-700 mt-0.5">
                    {item.price.toFixed(2).replace(".", ",")} &euro;
                  </p>
                  {!isAvailable && (
                    <span className="text-[10px] font-bold text-red-500 uppercase">
                      Epuise
                    </span>
                  )}
                </div>

                {/* Quantity controls */}
                {isAvailable && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    {qty > 0 && (
                      <>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center active:scale-90 transition-transform"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold tabular-nums">
                          {qty}
                        </span>
                      </>
                    )}
                    <button
                      onClick={() => addToCart(item)}
                      className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Floating cart button */}
      {totalItems > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <button
            onClick={() => setShowCart(true)}
            className="w-full py-3.5 px-6 bg-blue-600 text-white rounded-xl shadow-lg flex items-center justify-between hover:bg-blue-500 active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-semibold">
                {totalItems} article{totalItems > 1 ? "s" : ""}
              </span>
            </div>
            <span className="font-bold">
              {totalPrice.toFixed(2).replace(".", ",")} &euro;
            </span>
          </button>
        </div>
      )}

      {/* Cart drawer */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[85vh] flex flex-col"
            >
              {/* Cart header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">
                  Recapitulatif
                </h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-sm text-blue-600 font-medium"
                >
                  Fermer
                </button>
              </div>

              {/* Cart items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.menuItemId}
                    className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.price.toFixed(2).replace(".", ",")} &euro; x{" "}
                        {item.quantity}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => removeFromCart(item.menuItemId)}
                        className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center active:scale-90"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-5 text-center text-sm font-bold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => {
                          const menuItem = items.find((i) => i.id === item.menuItemId);
                          if (menuItem) addToCart(menuItem);
                        }}
                        className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center active:scale-90"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeItemCompletely(item.menuItemId)}
                        className="w-7 h-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center active:scale-90 ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Notes */}
                <div className="mt-4">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                    <StickyNote className="w-4 h-4" />
                    Notes pour la cuisine
                  </label>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Allergies, cuissons, modifications..."
                    rows={2}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                  />
                </div>

                {/* Priority indicator */}
                {priority !== "normal" && (
                  <div
                    className={`flex items-center gap-2 p-2.5 rounded-lg ${
                      priority === "rush"
                        ? "bg-orange-50 text-orange-600"
                        : "bg-purple-50 text-purple-600"
                    }`}
                  >
                    {priority === "rush" ? (
                      <Flame className="w-4 h-4" />
                    ) : (
                      <Star className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      Priorite : {priority === "rush" ? "Urgent" : "VIP"}
                    </span>
                  </div>
                )}
              </div>

              {/* Cart footer */}
              <div className="border-t border-gray-100 p-4 space-y-3">
                <div className="flex items-center justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>{totalPrice.toFixed(2).replace(".", ",")} &euro;</span>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-base flex items-center justify-center gap-2 hover:bg-blue-500 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Envoyer la commande
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
