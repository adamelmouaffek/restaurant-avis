"use client";

import { motion } from "motion/react";
import { Bell, Users, UtensilsCrossed, Clock, Receipt, Coffee, CircleDot } from "lucide-react";
import type { TableStatus } from "@/shared/types";

interface TableWithStatus {
  id: string;
  number: string;
  capacity: number | null;
  computed_status: TableStatus;
  calling_waiter: boolean;
  active_orders: number;
  total_amount: number;
  session: { id: string; status: string } | null;
}

interface TableCardProps {
  table: TableWithStatus;
  onClick: (table: TableWithStatus) => void;
}

const STATUS_CONFIG: Record<
  TableStatus,
  { bg: string; border: string; text: string; label: string; icon: React.ElementType }
> = {
  empty: {
    bg: "bg-gray-50",
    border: "border-gray-200",
    text: "text-gray-400",
    label: "Libre",
    icon: CircleDot,
  },
  occupied: {
    bg: "bg-blue-50",
    border: "border-blue-300",
    text: "text-blue-600",
    label: "Occupee",
    icon: Users,
  },
  ordering: {
    bg: "bg-blue-50",
    border: "border-blue-400",
    text: "text-blue-700",
    label: "Commande en cours",
    icon: UtensilsCrossed,
  },
  waiting_food: {
    bg: "bg-orange-50",
    border: "border-orange-300",
    text: "text-orange-600",
    label: "Attend les plats",
    icon: Clock,
  },
  eating: {
    bg: "bg-green-50",
    border: "border-green-300",
    text: "text-green-600",
    label: "En train de manger",
    icon: Coffee,
  },
  requesting_bill: {
    bg: "bg-red-50",
    border: "border-red-300",
    text: "text-red-600",
    label: "Demande l'addition",
    icon: Receipt,
  },
  calling_waiter: {
    bg: "bg-red-50",
    border: "border-red-400",
    text: "text-red-600",
    label: "Appel serveur",
    icon: Bell,
  },
};

export default function TableCard({ table, onClick }: TableCardProps) {
  const effectiveStatus: TableStatus = table.calling_waiter
    ? "calling_waiter"
    : (table.computed_status as TableStatus);
  const config = STATUS_CONFIG[effectiveStatus] || STATUS_CONFIG.empty;
  const Icon = config.icon;

  const isPulsing =
    effectiveStatus === "calling_waiter" || effectiveStatus === "ordering";

  return (
    <motion.button
      onClick={() => onClick(table)}
      whileTap={{ scale: 0.97 }}
      className={`relative w-full p-4 rounded-xl border-2 ${config.bg} ${config.border} text-left transition-shadow duration-200 hover:shadow-md active:shadow-sm`}
    >
      {/* Pulsing ring for urgent statuses */}
      {isPulsing && (
        <span
          className={`absolute inset-0 rounded-xl border-2 ${config.border} animate-ping opacity-30`}
        />
      )}

      {/* Table number */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl font-bold text-gray-900">
          {table.number}
        </span>
        {table.calling_waiter && (
          <motion.div
            animate={{ rotate: [0, -15, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          >
            <Bell className="w-5 h-5 text-red-500" />
          </motion.div>
        )}
      </div>

      {/* Status icon + label */}
      <div className={`flex items-center gap-1.5 ${config.text}`}>
        <Icon className="w-3.5 h-3.5" />
        <span className="text-xs font-medium truncate">{config.label}</span>
      </div>

      {/* Active orders info */}
      {table.active_orders > 0 && (
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>
            {table.active_orders} cmd{table.active_orders > 1 ? "s" : ""}
          </span>
          <span className="font-semibold text-gray-700">
            {table.total_amount.toFixed(2).replace(".", ",")} &euro;
          </span>
        </div>
      )}
    </motion.button>
  );
}

export type { TableWithStatus };
