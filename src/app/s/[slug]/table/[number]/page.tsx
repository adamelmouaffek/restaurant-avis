"use client";

import { useParams } from "next/navigation";
import TableDetailView from "@/modules/server/components/TableDetailView";

export default function TableDetailPage() {
  const params = useParams();
  return (
    <TableDetailView
      slug={params.slug as string}
      tableNumber={params.number as string}
    />
  );
}
