"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ChevronRight,
  CreditCard,
  Tag,
  Flame,
  Star,
  Ban,
  Clock,
  CheckCircle,
} from "lucide-react";
import type { OrderWithItems, OrderStatus } from "@/shared/types";

interface ServerOrderDetailModalProps {
  order: OrderWithItems;
  isOpen: boolean;
  onClose: () => void;
  onAction: (orderId: string, action: string, payload?: Record<string, unknown>) => Promise<void>;
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmee",
  modification_requested: "Modification",
  preparing: "En preparation",
  partially_ready: "Partiellement prete",
  ready: "Prete",
  delivered: "Servie",
  awaiting_payment: "Attente paiement",
  paid: "Payee",
  cancelled: "Annulee",
  rejected: "Refusee",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  modification_requested: "bg-amber-100 text-amber-800",
  preparing: "bg-orange-100 text-orange-800",
  partially_ready: "bg-lime-100 text-lime-800",
  ready: "bg-green-100 text-green-800",
  delivered: "bg-gray-100 text-gray-800",
  awaiting_payment: "bg-indigo-100 text-indigo-800",
  paid: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
  rejected: "bg-red-100 text-red-800",
};

const STATUS_FLOW: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "partially_ready",
  "ready",
  "delivered",
  "awaiting_payment",
  "paid",
];

const NEXT_STATUS_MAP: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "confirmed",
  confirmed: "preparing",
  modification_requested: "confirmed",
  preparing: "partially_ready",
  partially_ready: "ready",
  ready: "delivered",
  delivered: "awaiting_payment",
  awaiting_payment: "paid",
};

const NEXT_LABEL_MAP: Partial<Record<OrderStatus, string>> = {
  pending: "Confirmer",
  confirmed: "En preparation",
  modification_requested: "Reconfirmer",
  preparing: "Partiellement prete",
  partially_ready: "Prete a servir",
  ready: "Servie",
  delivered: "Attente paiement",
  awaiting_payment: "Marquer payee",
};

export default function ServerOrderDetailModal({
  order,
  isOpen,
  onClose,
  onAction,
}: ServerOrderDetailModalProps) {
  const [showDiscount, setShowDiscount] = useState(false);
  const [discountAmount, setDiscountAmount] = useState("");
  const [discountReason, setDiscountReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const status = order.status as OrderStatus;
  const totalItems = order.order_items.reduce((sum, item) => sum + item.quantity, 0);
  const netTotal = order.total_amount - order.discount_amount;

  const handleAction = async (action: string, payload?: Record<string, unknown>) => {
    setIsProcessing(true);
    try {
      await onAction(order.id, action, payload);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDiscount = async () => {
    const amount = parseFloat(discountAmount.replace(",", "."));
    if (isNaN(amount) || amount <= 0) return;
    await handleAction("discount", {
      discount_amount: amount,
      discount_reason: discountReason || null,
    });
    setShowDiscount(false);
    setDiscountAmount("");
    setDiscountReason("");
  };

  // Current step in the flow
  const currentFlowIndex = STATUS_FLOW.indexOf(status);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-gray-900">
                    Table {order.table_number}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[status]}`}
                  >
                    {STATUS_LABELS[status]}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {totalItems} article{totalItems > 1 ? "s" : ""} &middot;{" "}
                  {order.source === "waiter" ? "Commande serveur" : "Commande client"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Status progress bar */}
            {currentFlowIndex >= 0 && currentFlowIndex < STATUS_FLOW.length - 1 && (
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-1">
                  {STATUS_FLOW.slice(0, -1).map((s, i) => (
                    <div key={s} className="flex items-center flex-1">
                      <div
                        className={`h-1.5 rounded-full flex-1 ${
                          i <= currentFlowIndex ? "bg-blue-500" : "bg-gray-200"
                        }`}
                      />
                      {i < STATUS_FLOW.length - 2 && (
                        <ChevronRight className="w-3 h-3 text-gray-300 shrink-0 mx-0.5" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  {STATUS_FLOW.slice(0, -1).map((s, i) => (
                    <span
                      key={s}
                      className={`text-[9px] font-medium ${
                        i <= currentFlowIndex ? "text-blue-600" : "text-gray-400"
                      }`}
                    >
                      {STATUS_LABELS[s]}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Order items */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Articles
                </h3>
                {order.order_items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold flex items-center justify-center">
                        {item.quantity}
                      </span>
                      <div>
                        <span className="text-sm font-medium text-gray-800">
                          {item.name}
                        </span>
                        {item.notes && (
                          <p className="text-[11px] text-gray-400 italic">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">
                      {(item.price * item.quantity).toFixed(2).replace(".", ",")} &euro;
                    </span>
                  </div>
                ))}

                {/* Notes */}
                {order.notes && (
                  <p className="text-xs text-gray-500 italic p-2 bg-gray-50 rounded-lg">
                    Note : {order.notes}
                  </p>
                )}
              </div>

              {/* Price summary */}
              <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Sous-total</span>
                  <span>{order.total_amount.toFixed(2).replace(".", ",")} &euro;</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>
                      Remise{order.discount_reason ? ` (${order.discount_reason})` : ""}
                    </span>
                    <span>
                      -{order.discount_amount.toFixed(2).replace(".", ",")} &euro;
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-gray-900 pt-1.5 border-t border-gray-200">
                  <span>Total</span>
                  <span>{netTotal.toFixed(2).replace(".", ",")} &euro;</span>
                </div>
              </div>

              {/* Discount form */}
              {showDiscount && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-green-50 rounded-xl p-4 space-y-3"
                >
                  <h4 className="text-sm font-semibold text-gray-700">
                    Appliquer une remise
                  </h4>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="Montant (ex: 5,00)"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30"
                  />
                  <input
                    type="text"
                    placeholder="Raison (optionnel)"
                    value={discountReason}
                    onChange={(e) => setDiscountReason(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleDiscount}
                      disabled={isProcessing}
                      className="flex-1 py-2.5 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-500 disabled:opacity-50"
                    >
                      Appliquer
                    </button>
                    <button
                      onClick={() => setShowDiscount(false)}
                      className="py-2.5 px-4 rounded-lg bg-gray-200 text-gray-700 text-sm font-semibold"
                    >
                      Annuler
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Action buttons footer */}
            <div className="border-t border-gray-100 p-4 space-y-2">
              {/* Primary action: next status */}
              {NEXT_STATUS_MAP[status] && (
                <button
                  onClick={() =>
                    handleAction("status", { status: NEXT_STATUS_MAP[status] })
                  }
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-500 active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      {NEXT_LABEL_MAP[status]}
                    </>
                  )}
                </button>
              )}

              {/* Secondary actions */}
              <div className="flex flex-wrap gap-2">
                {/* Pay */}
                {!order.paid && !["cancelled", "rejected"].includes(status) && (
                  <button
                    onClick={() =>
                      handleAction("paid", { paid: true, payment_method: "server" })
                    }
                    disabled={isProcessing}
                    className="flex-1 min-w-[100px] py-2.5 rounded-lg bg-green-600 text-white text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-green-500 disabled:opacity-50"
                  >
                    <CreditCard className="w-4 h-4" />
                    Encaisser
                  </button>
                )}

                {/* Discount */}
                {!["cancelled", "rejected", "delivered"].includes(status) && (
                  <button
                    onClick={() => setShowDiscount(!showDiscount)}
                    disabled={isProcessing}
                    className="flex-1 min-w-[100px] py-2.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-gray-200 disabled:opacity-50"
                  >
                    <Tag className="w-4 h-4" />
                    Remise
                  </button>
                )}

                {/* Priority */}
                {["pending", "confirmed", "preparing"].includes(status) && (
                  <>
                    <button
                      onClick={() =>
                        handleAction("priority", {
                          priority: order.priority === "rush" ? "normal" : "rush",
                        })
                      }
                      disabled={isProcessing}
                      className={`py-2.5 px-4 rounded-lg text-sm font-semibold flex items-center gap-1.5 disabled:opacity-50 ${
                        order.priority === "rush"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <Flame className="w-4 h-4" />
                      {order.priority === "rush" ? "Normal" : "Urgent"}
                    </button>
                    <button
                      onClick={() =>
                        handleAction("priority", {
                          priority: order.priority === "vip" ? "normal" : "vip",
                        })
                      }
                      disabled={isProcessing}
                      className={`py-2.5 px-4 rounded-lg text-sm font-semibold flex items-center gap-1.5 disabled:opacity-50 ${
                        order.priority === "vip"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <Star className="w-4 h-4" />
                      VIP
                    </button>
                  </>
                )}

                {/* Cancel */}
                {["pending", "confirmed"].includes(status) && (
                  <button
                    onClick={() => handleAction("status", { status: "cancelled" })}
                    disabled={isProcessing}
                    className="py-2.5 px-4 rounded-lg bg-red-50 text-red-600 text-sm font-semibold flex items-center gap-1.5 hover:bg-red-100 disabled:opacity-50"
                  >
                    <Ban className="w-4 h-4" />
                    Annuler
                  </button>
                )}
              </div>

              {/* Info: time */}
              <p className="text-[11px] text-gray-400 text-center mt-1">
                <Clock className="w-3 h-3 inline mr-1" />
                Cree le{" "}
                {new Date(order.created_at).toLocaleString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "short",
                })}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
