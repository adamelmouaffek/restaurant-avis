import Image from "next/image";
import type { MenuItem } from "@/shared/types";

interface MenuItemCardProps {
  item: MenuItem;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  isAvailable?: boolean;
}

export default function MenuItemCard({ item, quantity, onAdd, onRemove, isAvailable = true }: MenuItemCardProps) {
  const priceFormatted = item.price.toFixed(2).replace(".", ",");

  return (
    <article className={`bg-white rounded-xl shadow-sm p-4 flex gap-3 transition-shadow duration-200 ${isAvailable ? "hover:shadow-md" : "opacity-50 grayscale"}`}>
      {/* Infos textuelles */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        {/* Nom + badge Epuise */}
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight">
            {item.name}
          </h3>
          {!isAvailable && (
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-red-100 text-red-600 rounded-full whitespace-nowrap">
              Epuise
            </span>
          )}
        </div>

        {/* Description (2 lignes max) */}
        {item.description && (
          <p className="text-sm text-gray-500 leading-snug line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Prix */}
        <p className="font-bold text-lg text-gray-900 mt-1">
          {priceFormatted}&nbsp;&euro;
        </p>

        {/* Allergenes */}
        {item.allergens && item.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {item.allergens.map((allergen) => (
              <span
                key={allergen}
                className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-medium"
              >
                {allergen}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Partie droite : image + controles quantite */}
      <div className="flex flex-col items-end justify-between shrink-0 gap-2">
        {/* Image ou emoji fallback */}
        <div className="w-24 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.name}
              width={96}
              height={80}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl" role="img" aria-label="Plat">
              🍽️
            </span>
          )}
        </div>

        {/* Controles +/- */}
        {!isAvailable ? (
          // Item indisponible : pas de bouton
          <div className="h-8" />
        ) : quantity === 0 ? (
          // Etat vide : un seul bouton +
          <button
            onClick={onAdd}
            className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-sm transition-all duration-200 hover:bg-gray-700 active:scale-90"
            aria-label={`Ajouter ${item.name}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        ) : (
          // Etat avec quantite : - N +
          <div className="flex items-center gap-2">
            <button
              onClick={onRemove}
              className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center transition-all duration-200 hover:bg-gray-200 active:scale-90"
              aria-label={`Retirer un ${item.name}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M5 12h14" />
              </svg>
            </button>

            <span className="w-5 text-center font-semibold text-gray-900 text-sm tabular-nums">
              {quantity}
            </span>

            <button
              onClick={onAdd}
              className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-sm transition-all duration-200 hover:bg-gray-700 active:scale-90"
              aria-label={`Ajouter un ${item.name}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
