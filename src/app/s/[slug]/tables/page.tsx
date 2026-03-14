"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import TableGrid from "@/modules/server/components/TableGrid";
import type { TableWithStatus } from "@/modules/server/components/TableCard";

export default function TablesPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [tables, setTables] = useState<TableWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  // Navigate to table detail page
  const handleTableClick = useCallback(
    (table: TableWithStatus) => {
      router.push(`/s/${slug}/table/${table.number}`);
    },
    [slug, router]
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
    </div>
  );
}
