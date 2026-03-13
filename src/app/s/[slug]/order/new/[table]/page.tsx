"use client";

import { useParams } from "next/navigation";
import TakeOrderView from "@/modules/server/components/TakeOrderView";

export default function NewOrderPage() {
  const params = useParams();
  const slug = params.slug as string;
  const tableNumber = params.table as string;

  return (
    <TakeOrderView
      slug={slug}
      tableNumber={tableNumber}
      tableSessionId={null}
    />
  );
}
