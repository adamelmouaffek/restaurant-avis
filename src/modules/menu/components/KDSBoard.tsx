"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/shared/lib/supabase/client";
import type { OrderWithItems, OrderStatus } from "@/shared/types";
import { KDSFilters, type KDSFilter } from "./KDSFilters";
import { KDSOrderCard } from "./KDSOrderCard";

interface KDSBoardProps {
  restaurantId: string;
  restaurantName: string;
  restaurantSlug: string;
}

const ACTIVE_STATUSES: OrderStatus[] = ["pending", "confirmed", "preparing", "ready"];

function useCurrentTime(intervalMs = 30_000): string {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }));

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }));
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return time;
}

export function KDSBoard({ restaurantId, restaurantName, restaurantSlug }: KDSBoardProps) {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [activeFilter, setActiveFilter] = useState<KDSFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentTime = useCurrentTime();

  // --- Fetch initial ---
  useEffect(() => {
    let cancelled = false;

    async function fetchOrders() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/kds/${restaurantSlug}/orders`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `Erreur ${res.status}`);
        }
        const data: OrderWithItems[] = await res.json();
        if (!cancelled) setOrders(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchOrders();
    return () => { cancelled = true; };
  }, [restaurantSlug]);

  // --- Fetch une commande complete par ID (apres INSERT realtime) ---
  const fetchOrderById = useCallback(async (orderId: string): Promise<OrderWithItems | null> => {
    try {
      const res = await fetch(`/api/menu/orders/${orderId}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }, []);

  // --- Supabase Realtime ---
  useEffect(() => {
    const channel = supabase
      .channel(`kds-${restaurantId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        async (payload) => {
          const { eventType, new: newRow, old: oldRow } = payload as {
            eventType: "INSERT" | "UPDATE" | "DELETE";
            new: Record<string, unknown>;
            old: Record<string, unknown>;
          };

          if (eventType === "INSERT") {
            const orderId = newRow.id as string;
            const fullOrder = await fetchOrderById(orderId);
            if (!fullOrder) return;

            setOrders((prev) => {
              // Eviter les doublons
              if (prev.some((o) => o.id === orderId)) return prev;
              return [fullOrder, ...prev];
            });
          }

          if (eventType === "UPDATE") {
            const newStatus = newRow.status as OrderStatus;
            const orderId = newRow.id as string;

            setOrders((prev) =>
              prev
                .map((o) =>
                  o.id === orderId
                    ? {
                        ...o,
                        status: newStatus,
                        updated_at: (newRow.updated_at as string) ?? o.updated_at,
                      }
                    : o
                )
                // Retirer les commandes qui ne sont plus "actives" (delivered/cancelled)
                .filter((o) => ACTIVE_STATUSES.includes(o.status))
            );

            // Supprimer la commande si statut DELETE (edge case)
            if (eventType === ("DELETE" as string)) {
              const deletedId = oldRow.id as string;
              setOrders((prev) => prev.filter((o) => o.id !== deletedId));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [restaurantId, fetchOrderById]);

  // --- Changement de statut (optimistic) ---
  const handleStatusChange = useCallback(async (orderId: string, newStatus: OrderStatus) => {
    // Optimistic update
    setOrders((prev) =>
      prev
        .map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        .filter((o) => ACTIVE_STATUSES.includes(o.status))
    );

    try {
      const res = await fetch(`/api/menu/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        // Rollback : re-fetch toutes les commandes
        const refetchRes = await fetch(`/api/kds/${restaurantSlug}/orders`);
        if (refetchRes.ok) {
          const data: OrderWithItems[] = await refetchRes.json();
          setOrders(data);
        }
      }
    } catch {
      // En cas d'erreur reseau, on laisse le Realtime corriger l'etat
    }
  }, [restaurantSlug]);

  // --- Calcul des counts pour les filtres ---
  const counts: Partial<Record<KDSFilter, number>> = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
  };

  // --- Filtrage ---
  const filteredOrders =
    activeFilter === "all"
      ? orders
      : orders.filter((o) => o.status === activeFilter);

  // --- Rendu ---
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white leading-tight">
            {restaurantName}
          </h1>
          <p className="text-sm text-gray-400">Ecran cuisine (KDS)</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-2xl font-mono text-gray-300 tabular-nums">
            {currentTime}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-orange-600 text-white text-sm font-bold px-3 py-1.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            {counts.all} commande{(counts.all ?? 0) > 1 ? "s" : ""}
          </span>
        </div>
      </header>

      {/* Filters */}
      <div className="px-4 pt-4">
        <KDSFilters
          activeFilter={activeFilter}
          onChange={setActiveFilter}
          counts={counts}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 p-4">
        {isLoading ? (
          // Le loading.tsx gere le skeleton, mais on affiche un fallback inline si besoin
          <div className="flex items-center justify-center h-48 text-gray-500">
            Chargement des commandes...
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <p className="text-red-400 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
            >
              Recharger la page
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2 text-center">
            <span className="text-4xl">&#10003;</span>
            <p className="text-gray-400 font-medium text-lg">
              Aucune commande en attente
            </p>
            <p className="text-gray-600 text-sm">
              Les nouvelles commandes apparaitront ici en temps reel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredOrders.map((order) => (
              <KDSOrderCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
