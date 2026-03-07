"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ExternalLink, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { supabase } from "@/shared/lib/supabase/client";
import type { OrderWithItems, OrderStatus } from "@/shared/types";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/modules/menu/types";

interface OrdersManagerProps {
  restaurantId: string;
}

type FilterType = OrderStatus | "all";

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: "all", label: "Toutes" },
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmees" },
  { value: "preparing", label: "En preparation" },
  { value: "ready", label: "Pretes" },
  { value: "delivered", label: "Servies" },
  { value: "cancelled", label: "Annulees" },
];

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  pending: "confirmed",
  confirmed: "preparing",
  preparing: "ready",
  ready: "delivered",
  delivered: null,
  cancelled: null,
};

const NEXT_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Confirmer",
  confirmed: "Demarrer preparation",
  preparing: "Marquer prete",
  ready: "Marquer servie",
  delivered: "",
  cancelled: "",
};

export function OrdersManager({ restaurantId }: OrdersManagerProps) {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [kdsSlug, setKdsSlug] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/menu/orders?restaurant_id=${restaurantId}&limit=100`);
      if (!res.ok) throw new Error("Erreur lors du chargement des commandes");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  const loadSlug = useCallback(async () => {
    try {
      const res = await fetch(`/api/avis/restaurants?id=${restaurantId}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.slug) setKdsSlug(data.slug);
      }
    } catch {
      // slug non critique
    }
  }, [restaurantId]);

  useEffect(() => {
    loadOrders();
    loadSlug();
  }, [loadOrders, loadSlug]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`orders-dashboard-${restaurantId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            // Fetch full order with items
            try {
              const res = await fetch(`/api/menu/orders/${payload.new.id}`);
              if (res.ok) {
                const newOrder = await res.json();
                setOrders((prev) => [newOrder, ...prev]);
              }
            } catch {
              // fallback: reload all
              loadOrders();
            }
          } else if (payload.eventType === "UPDATE") {
            setOrders((prev) =>
              prev.map((o) =>
                o.id === payload.new.id ? { ...o, ...payload.new } : o
              )
            );
          } else if (payload.eventType === "DELETE") {
            setOrders((prev) => prev.filter((o) => o.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [restaurantId, loadOrders]);

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingStatus(orderId);
    try {
      const res = await fetch(`/api/menu/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Impossible de changer le statut");
        return;
      }
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch {
      alert("Erreur reseau");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!confirm("Annuler cette commande ?")) return;
    await updateStatus(orderId, "cancelled");
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const activeCount = orders.filter(
    (o) => !["delivered", "cancelled"].includes(o.status)
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Commandes</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Suivi en temps reel des commandes tables
            </p>
          </div>
          {activeCount > 0 && (
            <Badge className="bg-orange-500 text-white text-sm px-3 py-1">
              {activeCount} active{activeCount > 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {kdsSlug && (
            <Link href={`/kds/${kdsSlug}`} target="_blank">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Ecran KDS
              </Button>
            </Link>
          )}
          <Button variant="outline" size="sm" onClick={loadOrders} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {FILTER_OPTIONS.map((opt) => {
          const count =
            opt.value === "all"
              ? orders.length
              : orders.filter((o) => o.status === opt.value).length;
          return (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                filter === opt.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-white text-muted-foreground border-input hover:bg-muted/50"
              }`}
            >
              {opt.label}
              <span
                className={`ml-1.5 text-xs ${
                  filter === opt.value ? "opacity-80" : "text-muted-foreground"
                }`}
              >
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
          {error}
          <Button variant="outline" size="sm" className="ml-3" onClick={loadOrders}>
            Reessayer
          </Button>
        </div>
      )}

      {/* Orders list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-white p-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="h-5 w-20 bg-gray-200 rounded" />
                <div className="h-5 w-24 bg-gray-200 rounded" />
                <div className="h-5 w-16 bg-gray-200 rounded ml-auto" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center text-muted-foreground text-sm">
          {filter === "all"
            ? "Aucune commande recue pour ce restaurant."
            : `Aucune commande avec le statut "${FILTER_OPTIONS.find((o) => o.value === filter)?.label}".`}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrder === order.id;
            const nextStatus = NEXT_STATUS[order.status];
            const isTerminal = ["delivered", "cancelled"].includes(order.status);

            return (
              <div
                key={order.id}
                className={`rounded-xl border bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md ${
                  order.status === "pending" ? "border-yellow-300" : "border-border"
                }`}
              >
                {/* Order row */}
                <div className="flex items-center gap-4 px-4 py-3">
                  {/* Table + time */}
                  <div className="flex-shrink-0">
                    <p className="font-semibold text-sm">Table {order.table_number}</p>
                    <p className="text-xs text-muted-foreground">{formatTime(order.created_at)}</p>
                  </div>

                  {/* Status badge */}
                  <Badge className={`text-xs flex-shrink-0 ${ORDER_STATUS_COLORS[order.status]}`}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </Badge>

                  {/* Items count */}
                  <span className="text-sm text-muted-foreground">
                    {order.order_items.reduce((sum, i) => sum + i.quantity, 0)} article
                    {order.order_items.reduce((sum, i) => sum + i.quantity, 0) > 1 ? "s" : ""}
                  </span>

                  {/* Total */}
                  <span className="text-sm font-semibold text-primary ml-auto">
                    {order.total_amount.toFixed(2)} €
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {nextStatus && (
                      <Button
                        size="sm"
                        disabled={updatingStatus === order.id}
                        onClick={() => updateStatus(order.id, nextStatus)}
                        className="text-xs h-8"
                      >
                        {updatingStatus === order.id ? "..." : NEXT_STATUS_LABEL[order.status]}
                      </Button>
                    )}
                    {!isTerminal && order.status !== "cancelled" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={updatingStatus === order.id}
                        onClick={() => cancelOrder(order.id)}
                        className="text-xs h-8 text-destructive hover:text-destructive border-destructive/30 hover:border-destructive"
                      >
                        Annuler
                      </Button>
                    )}
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className="p-1.5 rounded hover:bg-muted text-muted-foreground"
                      title={isExpanded ? "Replier" : "Voir le detail"}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t bg-muted/20 px-4 py-3 space-y-2">
                    {order.notes && (
                      <p className="text-xs text-muted-foreground italic mb-2">
                        Note : {order.notes}
                      </p>
                    )}
                    <ul className="space-y-1">
                      {order.order_items.map((oi) => (
                        <li key={oi.id} className="flex items-center justify-between text-sm">
                          <span>
                            <span className="font-medium">{oi.quantity}x</span>{" "}
                            {oi.name}
                            {oi.notes && (
                              <span className="text-muted-foreground italic ml-2 text-xs">
                                ({oi.notes})
                              </span>
                            )}
                          </span>
                          <span className="text-muted-foreground">
                            {(oi.price * oi.quantity).toFixed(2)} €
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-between pt-2 border-t text-sm font-semibold">
                      <span>Total</span>
                      <span className="text-primary">{order.total_amount.toFixed(2)} €</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
