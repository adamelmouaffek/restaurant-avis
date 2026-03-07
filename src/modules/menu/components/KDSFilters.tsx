"use client";

import type { OrderStatus } from "@/shared/types";

export type KDSFilter = OrderStatus | "all";

interface KDSFiltersProps {
  activeFilter: KDSFilter;
  onChange: (filter: KDSFilter) => void;
  counts: Partial<Record<KDSFilter, number>>;
}

interface FilterOption {
  value: KDSFilter;
  label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { value: "all", label: "Toutes" },
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmees" },
  { value: "preparing", label: "En preparation" },
  { value: "ready", label: "Pretes" },
];

export function KDSFilters({ activeFilter, onChange, counts }: KDSFiltersProps) {
  return (
    <div className="bg-gray-800 rounded-xl px-4 py-3 flex flex-wrap gap-2">
      {FILTER_OPTIONS.map(({ value, label }) => {
        const count = counts[value] ?? 0;
        const isActive = activeFilter === value;

        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`
              px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-150
              ${
                isActive
                  ? "bg-white text-gray-900"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
              }
            `}
          >
            {label}
            <span
              className={`ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold
                ${isActive ? "bg-gray-200 text-gray-800" : "bg-gray-600 text-gray-300"}
              `}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
