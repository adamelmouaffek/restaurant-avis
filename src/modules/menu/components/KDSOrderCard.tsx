"use client";

import { useState } from "react";
import type { OrderWithItems, OrderStatus, EstablishmentType } from "@/shared/types";
import { ORDER_STATUS_LABELS } from "@/modules/menu/types";
import { KDSTimerBadge } from "./KDSTimerBadge";
import { KDSRejectModal } from "./KDSRejectModal";
import { KDSItemChecklist } from "./KDSItemChecklist";
import { getLabels } from "@/shared/lib/labels";

interface KDSOrderCardProps {
  order: OrderWithItems;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onReject: (orderId: string, reason: string) => void;
  restaurantSlug: string;
  establishmentType?: EstablishmentType;
}

// Couleurs des badges statut — variantes dark pour le KDS
const STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  pending: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40",
  confirmed: "bg-blue-500/20 text-blue-300 border border-blue-500/40",
  modification_requested: "bg-amber-500/20 text-amber-300 border border-amber-500/40",
  preparing: "bg-orange-500/20 text-orange-300 border border-orange-500/40",
  partially_ready: "bg-lime-500/20 text-lime-300 border border-lime-500/40",
  ready: "bg-green-500/20 text-green-300 border border-green-500/40",
  delivered: "bg-gray-500/20 text-gray-300 border border-gray-500/40",
  awaiting_payment: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40",
  paid: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40",
  cancelled: "bg-red-500/20 text-red-300 border border-red-500/40",
  rejected: "bg-red-500/20 text-red-300 border border-red-500/40",
};

// Priority border styles
function getPriorityBorderClass(priority: "normal" | "rush" | "vip"): string {
  switch (priority) {
    case "rush":
      return "ring-2 ring-orange-400/60 shadow-[0_0_15px_rgba(251,146,60,0.3)]";
    case "vip":
      return "ring-2 ring-yellow-400/60 shadow-[0_0_15px_rgba(250,204,21,0.3)]";
    default:
      return "";
  }
}

// Priority badge
function PriorityBadge({ priority }: { priority: "normal" | "rush" | "vip" }) {
  if (priority === "normal") return null;

  const classes =
    priority === "rush"
      ? "bg-orange-500/20 text-orange-300 border-orange-500/40"
      : "bg-yellow-500/20 text-yellow-300 border-yellow-500/40";

  const label = priority === "rush" ? "RUSH" : "VIP";

  return (
    <span
      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${classes}`}
    >
      {label}
    </span>
  );
}

// Source badge
function SourceBadge({ source, waiterLabel }: { source: "client" | "waiter"; waiterLabel: string }) {
  const isClient = source === "client";
  return (
    <span
      className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${
        isClient
          ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
          : "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
      }`}
    >
      {isClient ? "Client" : waiterLabel}
    </span>
  );
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
    label: "Partiellement prete",
    nextStatus: "partially_ready",
    className: "bg-lime-600 hover:bg-lime-500 text-white",
  },
  partially_ready: {
    label: "Prete !",
    nextStatus: "ready",
    className: "bg-green-600 hover:bg-green-500 text-white",
  },
};

const REJECTABLE_STATUSES: OrderStatus[] = ["pending", "confirmed"];
const CANCELLABLE_STATUSES: OrderStatus[] = ["pending", "confirmed"];

export function KDSOrderCard({
  order,
  onStatusChange,
  onReject,
  restaurantSlug,
  establishmentType = "restaurant",
}: KDSOrderCardProps) {
  const labels = getLabels(establishmentType);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const actionBtn = ACTION_BUTTONS[order.status];
  const canCancel = CANCELLABLE_STATUSES.includes(order.status);
  const canReject = REJECTABLE_STATUSES.includes(order.status);
  const priority = order.priority || "normal";
  const source = order.source || "client";
  const priorityBorder = getPriorityBorderClass(priority);

  const handleRejectConfirm = (orderId: string, reason: string) => {
    setShowRejectModal(false);
    onReject(orderId, reason);
  };

  return (
    <>
      <div
        className={`bg-[#1E293B] border border-white/10 rounded-xl flex flex-col overflow-hidden transition-shadow ${priorityBorder}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-4 pt-4 pb-3 border-b border-white/10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-2xl font-bold tracking-tight text-white">
                {labels.table} {order.table_number}
              </p>
              <PriorityBadge priority={priority} />
              <SourceBadge source={source} waiterLabel={labels.waiter} />
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <KDSTimerBadge createdAt={order.created_at} priority={priority} />
              {order.estimated_prep_minutes && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded border bg-gray-600/50 text-gray-300 border-gray-500/40">
                  ~{order.estimated_prep_minutes} min
                </span>
              )}
            </div>
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
              STATUS_BADGE_CLASSES[order.status]
            }`}
          >
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>

        {/* Articles — interactive checklist */}
        <div className="px-4 py-3 flex-1">
          <KDSItemChecklist
            items={order.order_items}
            restaurantSlug={restaurantSlug}
            orderId={order.id}
          />

          {/* Notes generales */}
          {order.notes && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-xs text-gray-400 italic">
                Note : {order.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-gray-300">
            Total :{" "}
            <span className="text-white">
              {order.total_amount.toFixed(2)} €
            </span>
          </p>

          <div className="flex items-center gap-2">
            {/* Bouton rejeter */}
            {canReject && (
              <button
                onClick={() => setShowRejectModal(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-900/80 hover:bg-red-800 text-red-200 transition-colors"
              >
                Rejeter
              </button>
            )}

            {/* Bouton annuler */}
            {canCancel && (
              <button
                onClick={() => onStatusChange(order.id, "cancelled")}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1E293B] hover:bg-[#334155] text-gray-300 transition-colors"
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

      {/* Reject Modal */}
      {showRejectModal && (
        <KDSRejectModal
          orderId={order.id}
          tableNumber={order.table_number}
          onConfirm={handleRejectConfirm}
          onClose={() => setShowRejectModal(false)}
        />
      )}
    </>
  );
}
