"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  Phone,
  Receipt,
  Check,
  RefreshCw,
  HandMetal,
} from "lucide-react";
import type { ServiceRequest } from "@/shared/types";

export default function NotificationsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const fetchRequests = useCallback(
    async (showLoader = false) => {
      if (showLoader) setLoading(true);
      else setRefreshing(true);
      try {
        const res = await fetch(`/api/server/${slug}/service-requests`);
        if (res.ok) {
          const data: ServiceRequest[] = await res.json();
          setRequests(data);
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

  // Initial load + auto-refresh every 10s
  useEffect(() => {
    fetchRequests(true);
    const interval = setInterval(() => fetchRequests(false), 10000);
    return () => clearInterval(interval);
  }, [fetchRequests]);

  const handleAction = async (
    id: string,
    status: "acknowledged" | "resolved"
  ) => {
    setProcessingIds((prev) => new Set(prev).add(id));
    try {
      const res = await fetch(`/api/server/${slug}/service-requests`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        await fetchRequests(false);
      }
    } catch {
      // Silent fail
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "A l'instant";
    if (mins < 60) return `Il y a ${mins} min`;
    const hours = Math.floor(mins / 60);
    return `Il y a ${hours}h${mins % 60 > 0 ? `${String(mins % 60).padStart(2, "0")}` : ""}`;
  }

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const acknowledgedRequests = requests.filter(
    (r) => r.status === "acknowledged"
  );

  return (
    <div>
      {/* Header bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-2.5 flex items-center justify-between sticky top-[52px] z-30">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {pendingRequests.length} en attente
          </span>
          {acknowledgedRequests.length > 0 && (
            <span className="text-xs text-blue-500">
              &middot; {acknowledgedRequests.length} en cours
            </span>
          )}
        </div>
        <button
          onClick={() => fetchRequests(false)}
          disabled={refreshing}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          aria-label="Rafraichir"
        >
          <RefreshCw
            className={`w-4 h-4 text-gray-500 ${refreshing ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Tout est calme</p>
            <p className="text-sm mt-1">
              Aucune notification pour le moment.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {/* Pending first */}
            {pendingRequests.map((req) => (
              <motion.div
                key={req.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl border-2 border-red-200 p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      req.type === "call_waiter"
                        ? "bg-red-100 text-red-500"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {req.type === "call_waiter" ? (
                      <motion.div
                        animate={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        <HandMetal className="w-6 h-6" />
                      </motion.div>
                    ) : (
                      <Receipt className="w-6 h-6" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-gray-900">
                        Table {req.table_number}
                      </h3>
                      <span className="text-xs text-gray-400 shrink-0">
                        {timeAgo(req.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {req.type === "call_waiter"
                        ? "Appelle un serveur"
                        : "Demande l'addition"}
                    </p>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleAction(req.id, "acknowledged")}
                        disabled={processingIds.has(req.id)}
                        className="flex-1 py-2.5 px-4 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        <Phone className="w-4 h-4" />
                        J&apos;y vais
                      </button>
                      <button
                        onClick={() => handleAction(req.id, "resolved")}
                        disabled={processingIds.has(req.id)}
                        className="py-2.5 px-4 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-500 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        Fait
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Acknowledged */}
            {acknowledgedRequests.map((req) => (
              <motion.div
                key={req.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl border border-blue-200 p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                    {req.type === "call_waiter" ? (
                      <Phone className="w-6 h-6" />
                    ) : (
                      <Receipt className="w-6 h-6" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-gray-900">
                        Table {req.table_number}
                      </h3>
                      <span className="text-xs text-blue-500 font-medium shrink-0">
                        En cours
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {req.type === "call_waiter"
                        ? "Appelle un serveur"
                        : "Demande l'addition"}
                    </p>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleAction(req.id, "resolved")}
                        disabled={processingIds.has(req.id)}
                        className="flex-1 py-2.5 px-4 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-500 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        Marquer comme resolu
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
