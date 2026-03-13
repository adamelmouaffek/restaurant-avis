"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ShoppingBag, ChevronRight } from "lucide-react";

interface TableSessionBannerProps {
  slug: string;
  tableNumber: string;
  orderCount: number;
}

export default function TableSessionBanner({
  slug,
  tableNumber,
  orderCount,
}: TableSessionBannerProps) {
  if (orderCount <= 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-4 mt-2"
    >
      <Link
        href={`/m/${slug}/table/${tableNumber}/status`}
        className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 hover:bg-blue-100 transition-colors group"
      >
        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <ShoppingBag className="w-4.5 h-4.5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-blue-900">
            {orderCount} commande{orderCount > 1 ? "s" : ""} en cours
          </p>
          <p className="text-xs text-blue-600">
            Voir le statut de vos commandes
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-blue-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </motion.div>
  );
}
