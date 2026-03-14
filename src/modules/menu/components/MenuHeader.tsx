import Image from "next/image";
import type { Restaurant } from "@/shared/types";
import { getLabels } from "@/shared/lib/labels";

interface MenuHeaderProps {
  restaurant: Restaurant;
  tableNumber: string;
}

export default function MenuHeader({ restaurant, tableNumber }: MenuHeaderProps) {
  const labels = getLabels(restaurant.establishment_type);
  return (
    <header className="bg-[var(--et-bg)] shadow-lg sticky top-0 z-40">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
        {/* Logo ou initiale */}
        {restaurant.logo_url ? (
          <Image
            src={restaurant.logo_url}
            alt={restaurant.name}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-white/20"
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0 bg-gradient-to-br from-[var(--et-accent)] to-[var(--et-accent-light)]"
            aria-hidden="true"
          >
            {restaurant.name.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Nom du restaurant */}
        <span className="font-semibold text-white text-base flex-1 truncate">
          {restaurant.name}
        </span>

        {/* Badge table */}
        <span className="bg-white/10 text-white/80 text-sm font-medium px-3 py-1 rounded-full shrink-0 whitespace-nowrap">
          {labels.table} {tableNumber}
        </span>
      </div>
    </header>
  );
}
