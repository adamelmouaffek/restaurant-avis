"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "motion/react";
import {
  Clock,
  ChefHat,
  CheckCircle2,
  Truck,
  AlertCircle,
  Plus,
  Bell,
  Receipt,
  RefreshCw,
  CreditCard,
  Wallet,
  PenLine,
  Loader2,
} from "lucide-react";
import { PageTransition } from "@/shared/components/animations";
import type { OrderStatus, OrderWithItems, EstablishmentType } from "@/shared/types";
import { getLabels } from "@/shared/lib/labels";

// Supabase client for realtime subscriptions
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bgColor: string; icon: React.ElementType }
> = {
  pending: {
    label: "En attente",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100 border-yellow-200",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmee",
    color: "text-blue-700",
    bgColor: "bg-blue-100 border-blue-200",
    icon: CheckCircle2,
  },
  preparing: {
    label: "En preparation",
    color: "text-orange-700",
    bgColor: "bg-orange-100 border-orange-200",
    icon: ChefHat,
  },
  ready: {
    label: "Prete !",
    color: "text-green-700",
    bgColor: "bg-green-100 border-green-200",
    icon: CheckCircle2,
  },
  delivered: {
    label: "Servie",
    color: "text-gray-600",
    bgColor: "bg-gray-100 border-gray-200",
    icon: Truck,
  },
  cancelled: {
    label: "Annulee",
    color: "text-red-700",
    bgColor: "bg-red-100 border-red-200",
    icon: AlertCircle,
  },
  rejected: {
    label: "Refusee",
    color: "text-red-700",
    bgColor: "bg-red-100 border-red-200",
    icon: AlertCircle,
  },
  modification_requested: {
    label: "Modification demandee",
    color: "text-purple-700",
    bgColor: "bg-purple-100 border-purple-200",
    icon: PenLine,
  },
  partially_ready: {
    label: "Partiellement prete",
    color: "text-teal-700",
    bgColor: "bg-teal-100 border-teal-200",
    icon: Loader2,
  },
  awaiting_payment: {
    label: "Attente paiement",
    color: "text-indigo-700",
    bgColor: "bg-indigo-100 border-indigo-200",
    icon: CreditCard,
  },
  paid: {
    label: "Payee",
    color: "text-emerald-700",
    bgColor: "bg-emerald-100 border-emerald-200",
    icon: Wallet,
  },
};

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(amount: number): string {
  return amount.toFixed(2).replace(".", ",");
}

export default function OrderStatusPage() {
  const params = useParams();
  const slug = params.slug as string;
  const tableNumber = params.number as string;

  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tableSessionId, setTableSessionId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [establishmentType, setEstablishmentType] = useState<EstablishmentType>("restaurant");

  const labels = getLabels(establishmentType);

  // Fetch establishment type
  useEffect(() => {
    async function fetchEstablishmentType() {
      try {
        const { data } = await supabase
          .from("restaurants")
          .select("establishment_type")
          .eq("slug", slug)
          .single();
        if (data?.establishment_type) {
          setEstablishmentType(data.establishment_type);
        }
      } catch {
        // Fallback to default labels
      }
    }
    fetchEstablishmentType();
  }, [slug]);

  // Get table session ID from localStorage
  useEffect(() => {
    const storedSessionId = localStorage.getItem(
      `table_session_${slug}_${tableNumber}`
    );
    setTableSessionId(storedSessionId);
  }, [slug, tableNumber]);

  // Fetch orders — try by session first, always fallback to by-table
  const fetchOrders = useCallback(async () => {
    try {
      setError(null);
      let data = null;

      // Try by session ID first (if available)
      if (tableSessionId) {
        const res = await fetch(
          `/api/menu/orders/by-session?table_session_id=${tableSessionId}`
        );
        if (res.ok) {
          data = await res.json();
        }
      }

      // Always also fetch by table number to catch orders without session
      const fallbackRes = await fetch(
        `/api/menu/orders/by-table?slug=${slug}&table_number=${tableNumber}`
      );
      if (fallbackRes.ok) {
        const tableData = await fallbackRes.json();
        if (!data || data.length === 0) {
          data = tableData;
        } else {
          // Merge: add any orders from table that aren't already in session results
          const existingIds = new Set(data.map((o: { id: string }) => o.id));
          for (const order of tableData) {
            if (!existingIds.has(order.id)) {
              data.push(order);
            }
          }
          // Sort by created_at desc
          data.sort((a: { created_at: string }, b: { created_at: string }) =>
            b.created_at.localeCompare(a.created_at)
          );
        }
      }

      setOrders(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [tableSessionId, slug, tableNumber]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Subscribe to realtime order updates
  useEffect(() => {
    if (!tableSessionId) return;

    const channel = supabase
      .channel(`orders_${tableSessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `table_session_id=eq.${tableSessionId}`,
        },
        () => {
          // Refetch all orders on any change
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableSessionId, fetchOrders]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOrders();
  };

  // Send service request
  const handleServiceRequest = async (type: "call_waiter" | "request_bill") => {
    try {
      // Get restaurant_id from the first order, or fetch it
      const restaurantId = orders[0]?.restaurant_id;
      if (!restaurantId) return;

      await fetch("/api/menu/service-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          table_number: tableNumber,
          table_session_id: tableSessionId,
          type,
        }),
      });

      alert(
        type === "call_waiter"
          ? `Le ${labels.staffLabel} a ete appele !`
          : "Demande d'addition envoyee !"
      );
    } catch {
      alert("Erreur lors de l'envoi de la demande");
    }
  };

  // Cancel order (client can only cancel pending orders)
  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Voulez-vous vraiment annuler cette commande ?")) return;
    try {
      const res = await fetch(`/api/menu/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table_session_id: tableSessionId }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Impossible d'annuler cette commande");
        return;
      }
      fetchOrders();
    } catch {
      alert("Erreur lors de l'annulation");
    }
  };

  // Active orders (not terminal)
  const activeOrders = orders.filter(
    (o) => !["delivered", "cancelled", "paid", "awaiting_payment"].includes(o.status)
  );
  const completedOrders = orders.filter(
    (o) => ["delivered", "cancelled", "paid", "awaiting_payment"].includes(o.status)
  );

  // Note: no session check — we always try to fetch by table number as fallback

  return (
    <PageTransition className="min-h-dvh bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-gray-900 text-lg">Mes commandes</h1>
            <p className="text-xs text-gray-500">{labels.table} {tableNumber}</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
            aria-label="Rafraichir"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-32 space-y-6">
        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="text-center py-12 space-y-3">
            <p className="text-gray-500">{error}</p>
            <button
              onClick={handleRefresh}
              className="text-sm underline text-blue-600"
            >
              Reessayer
            </button>
          </div>
        )}

        {/* No orders yet */}
        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <p className="text-gray-400 text-lg">Aucune commande pour le moment.</p>
            <Link
              href={`/m/${slug}?table=${tableNumber}`}
              className="inline-flex items-center gap-2 bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Commander
            </Link>
          </div>
        )}

        {/* Active orders */}
        {!loading && !error && activeOrders.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              En cours
            </h2>
            <div className="space-y-4">
              <AnimatePresence>
                {activeOrders.map((order) => (
                  <OrderCard key={order.id} order={order} onCancel={handleCancelOrder} />
                ))}
              </AnimatePresence>
            </div>
          </section>
        )}

        {/* Completed orders */}
        {!loading && !error && completedOrders.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Terminees
            </h2>
            <div className="space-y-4">
              {completedOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </section>
        )}

        {/* Action buttons */}
        {!loading && !error && orders.length > 0 && (
          <section className="space-y-3 pt-4">
            {/* Order more */}
            <Link
              href={`/m/${slug}?table=${tableNumber}`}
              className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-blue-500 text-white font-semibold text-base shadow-md hover:bg-blue-600 transition-all active:scale-[0.98]"
            >
              <Plus className="w-5 h-5" />
              Commander plus
            </Link>

            {/* Service buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => handleServiceRequest("call_waiter")}
                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
              >
                <Bell className="w-4 h-4 text-blue-500" />
                Appeler le {labels.staffLabel}
              </button>
              <button
                onClick={() => handleServiceRequest("request_bill")}
                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
              >
                <Receipt className="w-4 h-4 text-blue-500" />
                L&apos;addition
              </button>
            </div>
          </section>
        )}
      </main>
    </PageTransition>
  );
}

/* ===== Order Card Component ===== */
function OrderCard({ order, onCancel }: { order: OrderWithItems; onCancel?: (orderId: string) => void }) {
  const statusConfig = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;
  const canCancel = order.status === "pending" && onCancel;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      {/* Status bar */}
      <div
        className={`flex items-center gap-2 px-4 py-2.5 border-b ${statusConfig.bgColor}`}
      >
        <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
        <span className={`text-sm font-semibold ${statusConfig.color}`}>
          {statusConfig.label}
        </span>
        <span className="ml-auto text-xs text-gray-500">
          {formatTime(order.created_at)}
        </span>
      </div>

      {/* Order items */}
      <div className="px-4 py-3 space-y-2">
        {order.order_items?.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <span className="text-sm text-gray-700">
              {item.quantity}x {item.name}
            </span>
            <span className="text-sm text-gray-500 tabular-nums">
              {formatPrice(item.price * item.quantity)}&nbsp;&euro;
            </span>
          </div>
        ))}
      </div>

      {/* Footer with total + cancel button */}
      <div className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-between bg-gray-50">
        <span className="text-xs text-gray-500 uppercase tracking-wide">
          Ref. {order.id.slice(0, 8).toUpperCase()}
        </span>
        <div className="flex items-center gap-3">
          {canCancel && (
            <button
              onClick={() => onCancel(order.id)}
              className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              Annuler
            </button>
          )}
          <span className="font-bold text-gray-900 text-sm tabular-nums">
            {formatPrice(order.total_amount)}&nbsp;&euro;
          </span>
        </div>
      </div>
    </motion.div>
  );
}
