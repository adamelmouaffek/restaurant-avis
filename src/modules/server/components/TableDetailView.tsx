"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  RefreshCw,
  UtensilsCrossed,
  Receipt,
  Clock,
  History,
  CreditCard,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import type { OrderWithItems, OrderStatus } from "@/shared/types";
import ServerOrderCard from "./ServerOrderCard";

interface TableDetailViewProps {
  slug: string;
  tableNumber: string;
}

const TAB_CONFIG = [
  { key: "active" as const, label: "Commandes", icon: Clock },
  { key: "history" as const, label: "Historique", icon: History },
  { key: "bill" as const, label: "Addition", icon: Receipt },
];

const ACTIVE_STATUSES: OrderStatus[] = ["pending", "confirmed", "preparing", "ready"];
const HISTORY_STATUSES: OrderStatus[] = ["delivered", "cancelled", "rejected"];

export default function TableDetailView({ slug, tableNumber }: TableDetailViewProps) {
  const router = useRouter();
  const [tab, setTab] = useState<"active" | "history" | "bill">("active");
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const fetchOrders = useCallback(
    async (showLoader = false) => {
      if (showLoader) setLoading(true);
      else setRefreshing(true);
      try {
        const res = await fetch(`/api/server/${slug}/orders?status=all&table=${tableNumber}`);
        if (res.ok) {
          const allOrders: OrderWithItems[] = await res.json();
          setOrders(allOrders);
        }
      } catch {
        // Silent fail
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [slug, tableNumber]
  );

  // Initial load + auto-refresh every 15s
  useEffect(() => {
    fetchOrders(true);
    const interval = setInterval(() => fetchOrders(false), 15000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Action handler for order updates
  const handleAction = useCallback(
    async (orderId: string, _action: string, payload?: Record<string, unknown>) => {
      try {
        const res = await fetch(`/api/server/${slug}/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload || {}),
        });

        if (res.ok) {
          const updatedOrder = await res.json();
          setOrders((prev) =>
            prev.map((o) =>
              o.id === orderId ? { ...o, ...updatedOrder } : o
            )
          );
          setTimeout(() => fetchOrders(false), 500);
        } else {
          const err = await res.json().catch(() => ({}));
          alert(err.error || "Erreur lors de la mise a jour");
        }
      } catch {
        alert("Erreur reseau");
      }
    },
    [slug, fetchOrders]
  );

  // Pay all unpaid orders + auto-clear history
  const handlePayAll = useCallback(async () => {
    const unpaid = orders.filter(
      (o) => !o.paid && !["cancelled", "rejected"].includes(o.status)
    );
    if (unpaid.length === 0) return;

    setPaying(true);
    try {
      await Promise.all(
        unpaid.map((o) =>
          fetch(`/api/server/${slug}/orders/${o.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paid: true, payment_method: "server" }),
          })
        )
      );
      // After payment, clear the table history
      await fetch(`/api/server/${slug}/orders/clear-table`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table_number: tableNumber }),
      });
      await fetchOrders(false);
    } catch {
      alert("Erreur lors de l'encaissement");
    } finally {
      setPaying(false);
    }
  }, [orders, slug, tableNumber, fetchOrders]);

  // Clear history manually
  const handleClearHistory = useCallback(async () => {
    setClearing(true);
    try {
      const res = await fetch(`/api/server/${slug}/orders/clear-table`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table_number: tableNumber }),
      });
      if (res.ok) {
        await fetchOrders(false);
        setShowClearConfirm(false);
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Erreur lors du nettoyage");
      }
    } catch {
      alert("Erreur reseau");
    } finally {
      setClearing(false);
    }
  }, [slug, tableNumber, fetchOrders]);

  // Filtered orders
  const activeOrders = orders.filter((o) =>
    ACTIVE_STATUSES.includes(o.status as OrderStatus)
  );
  const historyOrders = orders.filter((o) =>
    HISTORY_STATUSES.includes(o.status as OrderStatus)
  );
  const billOrders = orders.filter(
    (o) => !["cancelled", "rejected"].includes(o.status)
  );
  const grandTotal = billOrders.reduce((sum, o) => sum + o.total_amount, 0);
  const totalDiscounts = billOrders.reduce((sum, o) => sum + o.discount_amount, 0);
  const unpaidOrders = billOrders.filter((o) => !o.paid);
  const allPaid = billOrders.length > 0 && unpaidOrders.length === 0;

  return (
    <div className="min-h-[calc(100dvh-8rem)]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-[52px] z-30">
        <button
          onClick={() => router.push(`/s/${slug}/tables`)}
          className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-gray-900">Table {tableNumber}</h1>
          <p className="text-xs text-gray-500">
            {activeOrders.length} commande{activeOrders.length !== 1 ? "s" : ""} active{activeOrders.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => fetchOrders(false)}
          disabled={refreshing}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-gray-500 ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-100 px-4">
        <div className="flex gap-1 py-2">
          {TAB_CONFIG.map((t) => {
            const Icon = t.icon;
            const isActive = t.key === tab;
            const count = t.key === "active" ? activeOrders.length
              : t.key === "history" ? historyOrders.length
              : billOrders.length;
            return (
              <button
                key={t.key}
                onClick={() => {
                  setTab(t.key);
                  setExpandedId(null);
                }}
                className={`flex items-center gap-1.5 h-9 px-4 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
                {count > 0 && (
                  <span className={`ml-0.5 text-[10px] font-bold ${
                    isActive ? "text-blue-200" : "text-gray-400"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* ═══ ACTIVE TAB ═══ */}
            {tab === "active" && (
              <>
                {activeOrders.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <UtensilsCrossed className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p className="text-sm font-medium">Aucune commande active</p>
                  </div>
                ) : (
                  activeOrders.map((order) => (
                    <ServerOrderCard
                      key={order.id}
                      order={order}
                      isExpanded={expandedId === order.id}
                      onToggle={() =>
                        setExpandedId((prev) => (prev === order.id ? null : order.id))
                      }
                      onAction={handleAction}
                    />
                  ))
                )}

                {/* Take order button */}
                <button
                  onClick={() => router.push(`/s/${slug}/order/new/${tableNumber}`)}
                  className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-500 active:scale-[0.99] transition-all mt-4"
                >
                  <UtensilsCrossed className="w-5 h-5" />
                  Prendre commande
                </button>
              </>
            )}

            {/* ═══ HISTORY TAB ═══ */}
            {tab === "history" && (
              <>
                {historyOrders.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <History className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p className="text-sm font-medium">Aucun historique</p>
                  </div>
                ) : (
                  <>
                    {historyOrders.map((order) => (
                      <ServerOrderCard
                        key={order.id}
                        order={order}
                        isExpanded={expandedId === order.id}
                        onToggle={() =>
                          setExpandedId((prev) => (prev === order.id ? null : order.id))
                        }
                        onAction={handleAction}
                      />
                    ))}

                    {/* Clear history button */}
                    {!showClearConfirm ? (
                      <button
                        onClick={() => setShowClearConfirm(true)}
                        className="w-full py-3 rounded-xl bg-gray-100 text-gray-500 font-medium flex items-center justify-center gap-2 hover:bg-gray-200 active:scale-[0.99] transition-all mt-4 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Vider l&apos;historique
                      </button>
                    ) : (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
                        <p className="text-sm text-red-700 font-medium mb-3">
                          Supprimer l&apos;historique de la table {tableNumber} ?
                        </p>
                        <p className="text-xs text-red-500 mb-4">
                          Les commandes terminees seront archivees et ne seront plus visibles ici.
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={handleClearHistory}
                            disabled={clearing}
                            className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-500 active:scale-[0.98] transition-all disabled:opacity-50"
                          >
                            {clearing ? "Suppression..." : "Confirmer"}
                          </button>
                          <button
                            onClick={() => setShowClearConfirm(false)}
                            className="flex-1 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 active:scale-[0.98] transition-all"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* ═══ BILL TAB ═══ */}
            {tab === "bill" && (
              <>
                {billOrders.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <Receipt className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p className="text-sm font-medium">Aucune commande a facturer</p>
                  </div>
                ) : (
                  <>
                    {/* Orders breakdown */}
                    <div className="space-y-3">
                      {billOrders.map((order, idx) => (
                        <div
                          key={order.id}
                          className="bg-white rounded-xl border border-gray-100 p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-gray-500">
                              Commande {idx + 1}
                            </span>
                            {order.paid ? (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3" />
                                Payee
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                Non payee
                              </span>
                            )}
                          </div>
                          <div className="space-y-1.5">
                            {order.order_items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between text-sm"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 rounded bg-gray-100 text-gray-700 text-xs font-bold flex items-center justify-center">
                                    {item.quantity}
                                  </span>
                                  <span className="text-gray-800">{item.name}</span>
                                </div>
                                <span className="text-gray-500 text-xs">
                                  {(item.price * item.quantity).toFixed(2).replace(".", ",")} &euro;
                                </span>
                              </div>
                            ))}
                          </div>
                          {order.discount_amount > 0 && (
                            <div className="flex items-center justify-between text-sm text-green-600 mt-2 pt-2 border-t border-gray-50">
                              <span>Remise{order.discount_reason ? ` (${order.discount_reason})` : ""}</span>
                              <span>-{order.discount_amount.toFixed(2).replace(".", ",")} &euro;</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                            <span className="text-sm font-medium text-gray-600">Sous-total</span>
                            <span className="text-sm font-bold text-gray-900">
                              {(order.total_amount - order.discount_amount).toFixed(2).replace(".", ",")} &euro;
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Grand total */}
                    <div className="bg-gray-900 text-white rounded-xl p-4 mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white/70">Total</span>
                        <span className="text-2xl font-bold">
                          {(grandTotal - totalDiscounts).toFixed(2).replace(".", ",")} &euro;
                        </span>
                      </div>
                      {totalDiscounts > 0 && (
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-white/50">Dont remises</span>
                          <span className="text-xs text-green-400">
                            -{totalDiscounts.toFixed(2).replace(".", ",")} &euro;
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Pay all button */}
                    {!allPaid && (
                      <button
                        onClick={handlePayAll}
                        disabled={paying}
                        className="w-full py-3.5 rounded-xl bg-green-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-green-500 active:scale-[0.99] transition-all disabled:opacity-50 mt-2"
                      >
                        <CreditCard className="w-5 h-5" />
                        {paying
                          ? "Encaissement..."
                          : `Encaisser tout (${unpaidOrders.length} commande${unpaidOrders.length > 1 ? "s" : ""})`}
                      </button>
                    )}

                    {allPaid && (
                      <div className="space-y-3 mt-2">
                        <div className="text-center py-3">
                          <div className="flex items-center justify-center gap-2 text-green-600">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="font-semibold text-sm">Tout est encaisse</span>
                          </div>
                        </div>
                        {/* Clear table after full payment */}
                        <button
                          onClick={handleClearHistory}
                          disabled={clearing}
                          className="w-full py-3 rounded-xl bg-gray-100 text-gray-600 font-medium flex items-center justify-center gap-2 hover:bg-gray-200 active:scale-[0.99] transition-all text-sm disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          {clearing ? "Nettoyage..." : "Cloturer la table"}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
