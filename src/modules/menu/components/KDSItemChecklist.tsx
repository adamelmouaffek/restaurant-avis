"use client";

import { useState } from "react";
import type { OrderItem } from "@/shared/types";

interface KDSItemChecklistProps {
  items: OrderItem[];
  restaurantSlug: string;
  orderId: string;
}

export function KDSItemChecklist({
  items,
  restaurantSlug,
  orderId,
}: KDSItemChecklistProps) {
  const [itemStatuses, setItemStatuses] = useState<
    Record<string, "pending" | "preparing" | "done">
  >(() => {
    const map: Record<string, "pending" | "preparing" | "done"> = {};
    for (const item of items) {
      map[item.id] = item.item_status;
    }
    return map;
  });

  const toggleItem = async (itemId: string) => {
    const current = itemStatuses[itemId] || "pending";
    const next = current === "done" ? "pending" : "done";

    // Optimistic update
    setItemStatuses((prev) => ({ ...prev, [itemId]: next }));

    try {
      const res = await fetch(
        `/api/kds/${restaurantSlug}/orders/${orderId}/items/${itemId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ item_status: next }),
        }
      );
      if (!res.ok) {
        // Rollback
        setItemStatuses((prev) => ({ ...prev, [itemId]: current }));
      }
    } catch {
      // Rollback
      setItemStatuses((prev) => ({ ...prev, [itemId]: current }));
    }
  };

  return (
    <div className="space-y-1.5">
      {items.map((item) => {
        const status = itemStatuses[item.id] || "pending";
        const isDone = status === "done";

        return (
          <button
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className="w-full flex items-start gap-2 text-left group"
          >
            {/* Checkbox */}
            <span
              className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                isDone
                  ? "bg-green-500 border-green-500"
                  : "border-gray-500 group-hover:border-gray-400"
              }`}
            >
              {isDone && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3 h-3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </span>

            {/* Item info */}
            <div className="flex-1 min-w-0">
              <span
                className={`font-medium text-sm transition-colors ${
                  isDone
                    ? "text-gray-500 line-through"
                    : "text-white group-hover:text-gray-200"
                }`}
              >
                {item.quantity}x {item.name}
              </span>
              {item.notes && (
                <p
                  className={`text-xs mt-0.5 italic truncate ${
                    isDone ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {item.notes}
                </p>
              )}
            </div>

            {/* Price */}
            <span
              className={`text-xs whitespace-nowrap ${
                isDone ? "text-gray-600" : "text-gray-400"
              }`}
            >
              {(item.price * item.quantity).toFixed(2)} €
            </span>
          </button>
        );
      })}
    </div>
  );
}
