"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { RefreshCw } from "lucide-react";
import type { OrderWithItems } from "@/shared/types";
import ServerOrderCard from "@/modules/server/components/ServerOrderCard";
import ServerOrderDetailModal from "@/modules/server/components/ServerOrderDetail";

const STATUS_TABS: { key: string; label: string }[] = [
  { key: "active", label: "Actives" },
  { key: "pending", label: "En attente" },
  { key: "confirmed", label: "Confirmees" },
  { key: "preparing", label: "Preparation" },
  { key: "ready", label: "Pretes" },
];

export default function OrdersPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [detailOrder, setDetailOrder] = useState<OrderWithItems | null>(null);

  const fetchOrders = useCallback(
    async (showLoader = false) => {
      if (showLoader) setLoading(true);
      else setRefreshing(true);
      try {
        const statusParam =
          activeTab === "active" ? "" : `?status=${activeTab}`;
        const res = await fetch(
          `/api/server/${slug}/orders${statusParam}`
        );
        if (res.ok) {
          const data: OrderWithItems[] = await res.json();
          setOrders(data);
        }
      } catch {
        // Silent fail
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [slug, activeTab]
  );

  // Fetch on mount and tab change + auto-refresh every 15s
  useEffect(() => {
    fetchOrders(true);
    const interval = setInterval(() => fetchOrders(false), 15000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Action handler for order updates
  const handleAction = useCallback(
    async (orderId: string, action: string, payload?: Record<string, unknown>) => {
      try {
        const res = await fetch(`/api/server/${slug}/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload || {}),
        });

        if (res.ok) {
          const updatedOrder = await res.json();
          // Update orders list in place
          setOrders((prev) =>
            prev.map((o) =>
              o.id === orderId ? { ...o, ...updatedOrder } : o
            )
          );
          // Update detail modal if open
          if (detailOrder?.id === orderId) {
            setDetailOrder((prev) =>
              prev ? { ...prev, ...updatedOrder } : null
            );
          }
          // Refetch to get fresh data
          setTimeout(() => fetchOrders(false), 500);
        } else {
          const err = await res.json().catch(() => ({}));
          alert(err.error || "Erreur lors de la mise a jour");
        }
      } catch {
        alert("Erreur reseau");
      }
    },
    [slug, detailOrder, fetchOrders]
  );

  // Filter orders based on tab
  const filteredOrders = orders.filter((o) => {
    if (activeTab === "active") {
      return ["pending", "confirmed", "preparing", "ready"].includes(o.status);
    }
    return o.status === activeTab;
  });

  return (
    <div>
      {/* Tab bar */}
      <div className="bg-white border-b border-gray-100 sticky top-[52px] z-30">
        <div className="flex items-center justify-between px-4">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setExpandedId(null);
                }}
                className={`shrink-0 h-8 px-3 rounded-full text-xs font-medium transition-all ${
                  tab.key === activeTab
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => fetchOrders(false)}
            disabled={refreshing}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 shrink-0 ml-2"
            aria-label="Rafraichir"
          >
            <RefreshCw
              className={`w-4 h-4 text-gray-500 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium">Aucune commande</p>
            <p className="text-sm mt-1">
              {activeTab === "active"
                ? "Aucune commande active pour le moment."
                : `Aucune commande avec le statut selectionne.`}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <ServerOrderCard
              key={order.id}
              order={order}
              isExpanded={expandedId === order.id}
              onToggle={() =>
                setExpandedId((prev) =>
                  prev === order.id ? null : order.id
                )
              }
              onAction={(orderId, action, payload) => {
                handleAction(orderId, action, payload);
              }}
            />
          ))
        )}
      </div>

      {/* Detail modal */}
      {detailOrder && (
        <ServerOrderDetailModal
          order={detailOrder}
          isOpen={!!detailOrder}
          onClose={() => setDetailOrder(null)}
          onAction={handleAction}
        />
      )}
    </div>
  );
}
