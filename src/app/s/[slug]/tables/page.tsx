"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  RefreshCw,
  X,
  UtensilsCrossed,
  Clock,
  Receipt,
  ExternalLink,
} from "lucide-react";
import TableGrid from "@/modules/server/components/TableGrid";
import type { TableWithStatus } from "@/modules/server/components/TableCard";
import type { OrderWithItems, TableStatus } from "@/shared/types";

const TABLE_STATUS_LABELS: Record<TableStatus, string> = {
  empty: "Libre",
  occupied: "Occupee",
  ordering: "Commande en cours",
  waiting_food: "Attend les plats",
  eating: "En train de manger",
  requesting_bill: "Demande l'addition",
  calling_waiter: "Appel serveur",
};

export default function TablesPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [tables, setTables] = useState<TableWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableWithStatus | null>(null);
  const [tableOrders, setTableOrders] = useState<OrderWithItems[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const fetchTables = useCallback(
    async (showLoader = false) => {
      if (showLoader) setLoading(true);
      else setRefreshing(true);
      try {
        const res = await fetch(`/api/server/${slug}/tables`);
        if (res.ok) {
          const data = await res.json();
          setTables(data);
        }
      } catch {
        // Silent fail
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [slug]
  );

  // Initial load + auto-refresh every 15s
  useEffect(() => {
    fetchTables(true);
    const interval = setInterval(() => fetchTables(false), 15000);
    return () => clearInterval(interval);
  }, [fetchTables]);

  // Fetch orders when a table is selected
  const handleTableClick = useCallback(
    async (table: TableWithStatus) => {
      setSelectedTable(table);
      if (table.active_orders > 0) {
        setLoadingOrders(true);
        try {
          const res = await fetch(`/api/server/${slug}/orders`);
          if (res.ok) {
            const allOrders: OrderWithItems[] = await res.json();
            setTableOrders(
              allOrders.filter((o) => o.table_number === table.number)
            );
          }
        } catch {
          // Silent fail
        } finally {
          setLoadingOrders(false);
        }
      } else {
        setTableOrders([]);
      }
    },
    [slug]
  );

  // Stats bar
  const occupiedCount = tables.filter(
    (t) => t.computed_status !== "empty"
  ).length;
  const urgentCount = tables.filter(
    (t) => t.calling_waiter || t.computed_status === "requesting_bill"
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Stats bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500">
            <span className="font-semibold text-gray-900">{occupiedCount}</span>{" "}
            / {tables.length} occupees
          </span>
          {urgentCount > 0 && (
            <span className="text-red-600 font-semibold animate-pulse">
              {urgentCount} alerte{urgentCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <button
          onClick={() => fetchTables(false)}
          disabled={refreshing}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          aria-label="Rafraichir"
        >
          <RefreshCw
            className={`w-4 h-4 text-gray-500 ${refreshing ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* Table grid */}
      <TableGrid tables={tables} onTableClick={handleTableClick} />

      {/* Table detail panel (bottom sheet) */}
      <AnimatePresence>
        {selectedTable && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTable(null)}
              className="fixed inset-0 bg-black/40 z-50"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[75vh] flex flex-col"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Table {selectedTable.number}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {TABLE_STATUS_LABELS[selectedTable.computed_status as TableStatus] || selectedTable.computed_status}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTable(null)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Panel content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Session info */}
                {selectedTable.session && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl text-sm text-blue-700">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>Session active</span>
                  </div>
                )}

                {/* Active orders */}
                {loadingOrders ? (
                  <div className="flex justify-center py-6">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : tableOrders.length > 0 ? (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      Commandes actives
                    </h3>
                    {tableOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-gray-50 rounded-xl p-3 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-800">
                            {order.order_items.reduce(
                              (sum, i) => sum + i.quantity,
                              0
                            )}{" "}
                            articles
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {order.total_amount
                              .toFixed(2)
                              .replace(".", ",")}{" "}
                            &euro;
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {order.order_items.map((item) => (
                            <span
                              key={item.id}
                              className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-600 border border-gray-200"
                            >
                              {item.quantity}x {item.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  selectedTable.computed_status !== "empty" && (
                    <p className="text-sm text-gray-400 text-center py-4">
                      Aucune commande active
                    </p>
                  )
                )}

                {/* Amount summary */}
                {selectedTable.total_amount > 0 && (
                  <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Receipt className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Total en cours
                      </span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {selectedTable.total_amount
                        .toFixed(2)
                        .replace(".", ",")}{" "}
                      &euro;
                    </span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="border-t border-gray-100 p-4 space-y-2">
                <button
                  onClick={() =>
                    router.push(
                      `/s/${slug}/order/new/${selectedTable.number}`
                    )
                  }
                  className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-500 active:scale-[0.99] transition-all"
                >
                  <UtensilsCrossed className="w-5 h-5" />
                  Prendre commande
                </button>

                {selectedTable.active_orders > 0 && (
                  <button
                    onClick={() => {
                      setSelectedTable(null);
                      router.push(`/s/${slug}/orders`);
                    }}
                    className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 active:scale-[0.99] transition-all text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Voir les commandes
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
