"use client";

import type { OrderWithItems, OrderStatus } from "@/shared/types";
import { ORDER_STATUS_LABELS } from "@/modules/menu/types";

interface KDSOrderCardProps {
  order: OrderWithItems;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

// Couleurs des badges statut — variantes dark pour le KDS
const STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  pending: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40",
  confirmed: "bg-blue-500/20 text-blue-300 border border-blue-500/40",
  preparing: "bg-orange-500/20 text-orange-300 border border-orange-500/40",
  ready: "bg-green-500/20 text-green-300 border border-green-500/40",
  delivered: "bg-gray-500/20 text-gray-300 border border-gray-500/40",
  cancelled: "bg-red-500/20 text-red-300 border border-red-500/40",
};

function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const past = new Date(dateString).getTime();
  const diffMs = now - past;

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffH = Math.floor(diffMin / 60);

  if (diffSec < 60) return "il y a quelques secondes";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  return `il y a ${diffH}h${String(diffMin % 60).padStart(2, "0")}`;
}

interface ActionButton {
  label: string;
  nextStatus: OrderStatus;
  className: string;
}

const ACTION_BUTTONS: Partial<Record<OrderStatus, ActionButton>> = {
  pending: {
    label: "Confirmer",
    nextStatus: "confirmed",
    className: "bg-blue-600 hover:bg-blue-500 text-white",
  },
  confirmed: {
    label: "En preparation",
    nextStatus: "preparing",
    className: "bg-orange-600 hover:bg-orange-500 text-white",
  },
  preparing: {
    label: "Prete !",
    nextStatus: "ready",
    className: "bg-green-600 hover:bg-green-500 text-white",
  },
  ready: {
    label: "Servie",
    nextStatus: "delivered",
    className: "bg-gray-600 hover:bg-gray-500 text-white",
  },
};

const CANCELLABLE_STATUSES: OrderStatus[] = ["pending", "confirmed"];

export function KDSOrderCard({ order, onStatusChange }: KDSOrderCardProps) {
  const actionBtn = ACTION_BUTTONS[order.status];
  const canCancel = CANCELLABLE_STATUSES.includes(order.status);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-4 pt-4 pb-3 border-b border-gray-700">
        <div>
          <p className="text-2xl font-bold tracking-tight">
            Table {order.table_number}
          </p>
          <p className="text-sm text-gray-400 mt-0.5">
            {formatRelativeTime(order.created_at)}
          </p>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            STATUS_BADGE_CLASSES[order.status]
          }`}
        >
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      {/* Articles */}
      <div className="px-4 py-3 flex-1 space-y-2">
        {order.order_items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <span className="font-medium text-white">
                {item.quantity}× {item.name}
              </span>
              {item.notes && (
                <p className="text-xs text-gray-400 mt-0.5 italic truncate">
                  {item.notes}
                </p>
              )}
            </div>
            <span className="text-sm text-gray-400 whitespace-nowrap">
              {(item.price * item.quantity).toFixed(2)} €
            </span>
          </div>
        ))}

        {/* Notes generales */}
        {order.notes && (
          <div className="mt-3 pt-3 border-t border-gray-700">
            <p className="text-xs text-gray-400 italic">
              Note : {order.notes}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 pt-3 border-t border-gray-700 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-gray-300">
          Total :{" "}
          <span className="text-white">{order.total_amount.toFixed(2)} €</span>
        </p>

        <div className="flex items-center gap-2">
          {/* Bouton annuler */}
          {canCancel && (
            <button
              onClick={() => onStatusChange(order.id, "cancelled")}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-900 hover:bg-red-800 text-red-200 transition-colors"
            >
              Annuler
            </button>
          )}

          {/* Bouton action principale */}
          {actionBtn && (
            <button
              onClick={() => onStatusChange(order.id, actionBtn.nextStatus)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${actionBtn.className}`}
            >
              {actionBtn.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
