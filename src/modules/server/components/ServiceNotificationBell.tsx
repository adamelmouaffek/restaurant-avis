"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Phone, Receipt, X, Check } from "lucide-react";
import type { ServiceRequest } from "@/shared/types";

interface ServiceNotificationBellProps {
  slug: string;
}

export default function ServiceNotificationBell({ slug }: ServiceNotificationBellProps) {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch(`/api/server/${slug}/service-requests`);
      if (res.ok) {
        const data: ServiceRequest[] = await res.json();
        setRequests(data);
      }
    } catch {
      // Silent fail
    }
  }, [slug]);

  // Poll every 10 seconds
  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 10000);
    return () => clearInterval(interval);
  }, [fetchRequests]);

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  const handleAction = async (id: string, status: "acknowledged" | "resolved") => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/server/${slug}/service-requests`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        await fetchRequests();
      }
    } catch {
      // Silent fail
    } finally {
      setIsLoading(false);
    }
  };

  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "A l'instant";
    if (mins < 60) return `${mins} min`;
    return `${Math.floor(mins / 60)}h`;
  }

  return (
    <>
      {/* Bell button with badge */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2"
        aria-label={`Notifications${pendingCount > 0 ? ` (${pendingCount})` : ""}`}
      >
        <Bell className="w-6 h-6 text-white" />
        {pendingCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
          >
            {pendingCount}
          </motion.span>
        )}
      </button>

      {/* Notification panel (slide from right) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Requests list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {requests.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Bell className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Aucune notification</p>
                  </div>
                ) : (
                  requests.map((req) => (
                    <motion.div
                      key={req.id}
                      layout
                      className={`p-4 rounded-xl border ${
                        req.status === "pending"
                          ? "border-red-200 bg-red-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            req.type === "call_waiter"
                              ? "bg-red-100 text-red-500"
                              : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {req.type === "call_waiter" ? (
                            <Phone className="w-5 h-5" />
                          ) : (
                            <Receipt className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-900">
                              Table {req.table_number}
                            </span>
                            <span className="text-xs text-gray-400">
                              {timeAgo(req.created_at)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-0.5">
                            {req.type === "call_waiter"
                              ? "Appelle un serveur"
                              : "Demande l'addition"}
                          </p>

                          {/* Actions */}
                          {req.status === "pending" && (
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => handleAction(req.id, "acknowledged")}
                                disabled={isLoading}
                                className="flex-1 py-2 px-3 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 active:scale-[0.98] transition-all disabled:opacity-50"
                              >
                                J&apos;y vais
                              </button>
                              <button
                                onClick={() => handleAction(req.id, "resolved")}
                                disabled={isLoading}
                                className="py-2 px-3 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-500 active:scale-[0.98] transition-all disabled:opacity-50"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          {req.status === "acknowledged" && (
                            <div className="flex gap-2 mt-3">
                              <span className="text-xs text-blue-600 font-medium">En cours...</span>
                              <button
                                onClick={() => handleAction(req.id, "resolved")}
                                disabled={isLoading}
                                className="ml-auto py-1.5 px-3 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-500 active:scale-[0.98] transition-all disabled:opacity-50"
                              >
                                Resolu
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
