import Image from "next/image";
import type { Restaurant } from "@/shared/types";

interface MenuHeaderProps {
  restaurant: Restaurant;
  tableNumber: string;
}

export default function MenuHeader({ restaurant, tableNumber }: MenuHeaderProps) {
  const primaryColor = restaurant.primary_color || "#1a1a1a";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
        {/* Logo ou initiale */}
        {restaurant.logo_url ? (
          <Image
            src={restaurant.logo_url}
            alt={restaurant.name}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0"
            style={{ backgroundColor: primaryColor }}
            aria-hidden="true"
          >
            {restaurant.name.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Nom du restaurant */}
        <span className="font-semibold text-gray-900 text-base flex-1 truncate">
          {restaurant.name}
        </span>

        {/* Badge table */}
        <span className="bg-gray-100 text-gray-600 text-sm font-medium px-3 py-1 rounded-full shrink-0 whitespace-nowrap">
          Table {tableNumber}
        </span>
      </div>
    </header>
  );
}
