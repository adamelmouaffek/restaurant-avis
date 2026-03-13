"use client";

import TableCard from "./TableCard";
import type { TableWithStatus } from "./TableCard";

interface TableGridProps {
  tables: TableWithStatus[];
  onTableClick: (table: TableWithStatus) => void;
}

export default function TableGrid({ tables, onTableClick }: TableGridProps) {
  if (tables.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <p className="text-lg font-medium">Aucune table configuree</p>
        <p className="text-sm mt-1">
          Ajoutez des tables depuis le tableau de bord.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4">
      {tables.map((table) => (
        <TableCard key={table.id} table={table} onClick={onTableClick} />
      ))}
    </div>
  );
}
