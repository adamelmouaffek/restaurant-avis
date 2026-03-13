"use client";

import { motion } from "motion/react";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";
import type { OrderWithItems, OrderStatus } from "@/shared/types";

interface ServerOrderCardProps {
  order: OrderWithItems;
  isExpanded: boolean;
  onToggle: () => void;
  onAction: (orderId: string, action: string, payload?: Record<string, unknown>) => void;
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmee",
  preparing: "En preparation",
  ready: "Prete",
  delivered: "Servie",
  cancelled: "Annulee",
  rejected: "Refusee",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-orange-100 text-orange-800",
  ready: "bg-green-100 text-green-800",
  delivered: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
  rejected: "bg-red-100 text-red-800",
};

const PRIORITY_BADGE: Record<string, string> = {
  rush: "bg-orange-500 text-white",
  vip: "bg-purple-500 text-white",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "A l'instant";
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  return `${hours}h${mins % 60 > 0 ? `${String(mins % 60).padStart(2, "0")}` : ""}`;
}

export default function ServerOrderCard({
  order,
  isExpanded,
  onToggle,
  onAction,
}: ServerOrderCardProps) {
  const status = order.status as OrderStatus;
  const totalItems = order.order_items.reduce((sum, item) => sum + item.quantity, 0);
  const displayTotal = (order.total_amount - order.discount_amount).toFixed(2).replace(".", ",");

  return (
    <motion.div
      layout
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Header - always visible */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center gap-3 text-left"
      >
        {/* Table number */}
        <div className="w-12 h-12 rounded-lg bg-gray-900 text-white flex items-center justify-center font-bold text-lg shrink-0">
          {order.table_number}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[status]}`}
            >
              {STATUS_LABELS[status]}
            </span>
            {order.priority !== "normal" && (
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${PRIORITY_BADGE[order.priority] || ""}`}
              >
                {order.priority}
              </span>
            )}
            {order.paid && (
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-green-500 text-white">
                Paye
              </span>
            )}
            {order.source === "waiter" && (
              <span className="text-[10px] text-gray-400 font-medium">
                Serveur
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{timeAgo(order.created_at)}</span>
            <span className="text-gray-300">|</span>
            <span>{totalItems} article{totalItems > 1 ? "s" : ""}</span>
            <span className="text-gray-300">|</span>
            <span className="font-semibold text-gray-700">{displayTotal} &euro;</span>
          </div>
        </div>

        {/* Expand toggle */}
        <div className="shrink-0 text-gray-400">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </button>

      {/* Expanded detail */}
      {isExpanded && (
        <ServerOrderDetail order={order} onAction={onAction} />
      )}
    </motion.div>
  );
}

// Inline detail component
function ServerOrderDetail({
  order,
  onAction,
}: {
  order: OrderWithItems;
  onAction: (orderId: string, action: string, payload?: Record<string, unknown>) => void;
}) {
  const status = order.status as OrderStatus;

  const NEXT_STATUS: Partial<Record<OrderStatus, { label: string; next: OrderStatus }>> = {
    pending: { label: "Confirmer", next: "confirmed" },
    confirmed: { label: "En preparation", next: "preparing" },
    preparing: { label: "Prete", next: "ready" },
    ready: { label: "Servie", next: "delivered" },
  };

  const nextAction = NEXT_STATUS[status];

  return (
    <div className="border-t border-gray-100 px-4 pb-4">
      {/* Items list */}
      <div className="py-3 space-y-2">
        {order.order_items.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
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
        {order.notes && (
          <p className="text-xs text-gray-500 italic mt-2 p-2 bg-gray-50 rounded-lg">
            Note : {order.notes}
          </p>
        )}
        {order.discount_amount > 0 && (
          <div className="flex items-center justify-between text-sm text-green-600 mt-1">
            <span>Remise{order.discount_reason ? ` (${order.discount_reason})` : ""}</span>
            <span>-{order.discount_amount.toFixed(2).replace(".", ",")} &euro;</span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 mt-2">
        {/* Next status */}
        {nextAction && (
          <button
            onClick={() => onAction(order.id, "status", { status: nextAction.next })}
            className="flex-1 min-w-[120px] py-2.5 px-4 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 active:scale-[0.98] transition-all"
          >
            {nextAction.label}
          </button>
        )}

        {/* Mark as paid */}
        {!order.paid && ["delivered", "ready", "preparing", "confirmed"].includes(status) && (
          <button
            onClick={() => onAction(order.id, "paid", { paid: true, payment_method: "server" })}
            className="py-2.5 px-4 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-500 active:scale-[0.98] transition-all"
          >
            Encaisser
          </button>
        )}

        {/* Priority toggle */}
        {["pending", "confirmed", "preparing"].includes(status) && (
          <button
            onClick={() =>
              onAction(order.id, "priority", {
                priority: order.priority === "rush" ? "normal" : "rush",
              })
            }
            className={`py-2.5 px-4 rounded-lg text-sm font-semibold active:scale-[0.98] transition-all ${
              order.priority === "rush"
                ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {order.priority === "rush" ? "Normal" : "Urgent"}
          </button>
        )}

        {/* Cancel (only pending/confirmed) */}
        {["pending", "confirmed"].includes(status) && (
          <button
            onClick={() => onAction(order.id, "status", { status: "cancelled" })}
            className="py-2.5 px-4 rounded-lg bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 active:scale-[0.98] transition-all"
          >
            Annuler
          </button>
        )}
      </div>
    </div>
  );
}

export { ServerOrderDetail };
