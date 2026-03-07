"use client";

import { useState, useEffect, useRef } from "react";
import type { CartItem } from "@/modules/menu/types";
import type { MenuItem, MenuItemWithCategory } from "@/shared/types";

interface CartDrawerProps {
  items: CartItem[];
  onAdd: (item: MenuItem) => void;
  onRemove: (menuItemId: string) => void;
  total: number;
  isOpen: boolean;
  onClose: () => void;
  onOrder: (notes: string) => void;
  isSubmitting: boolean;
  /** Items complets du menu pour retrouver l'objet MenuItem depuis un CartItem */
  menuItems: MenuItemWithCategory[];
}

export default function CartDrawer({
  items,
  onAdd,
  onRemove,
  total,
  isOpen,
  onClose,
  onOrder,
  isSubmitting,
  menuItems,
}: CartDrawerProps) {
  const [notes, setNotes] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Empeche le scroll du body quand le drawer est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Retrouve le MenuItem complet depuis l'id du CartItem
  function getMenuItem(menuItemId: string): MenuItem | undefined {
    return menuItems.find((m) => m.id === menuItemId);
  }

  const totalFormatted = total.toFixed(2).replace(".", ",");

  return (
    <>
      {/* Overlay sombre */}
      <div
        className={[
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Votre commande"
        className={[
          "fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-2xl shadow-2xl",
          "transition-transform duration-300 ease-out",
          "flex flex-col max-h-[90dvh]",
          isOpen ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
      >
        {/* Handle de glissement (decoration) */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg">Votre commande</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors duration-150"
            aria-label="Fermer le panier"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Corps scrollable */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {items.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">
              Votre panier est vide.
            </p>
          ) : (
            <>
              {/* Liste des items */}
              <ul className="space-y-3">
                {items.map((cartItem) => {
                  const menuItem = getMenuItem(cartItem.menuItemId);
                  const lineTotal = (cartItem.price * cartItem.quantity)
                    .toFixed(2)
                    .replace(".", ",");

                  return (
                    <li
                      key={cartItem.menuItemId}
                      className="flex items-center gap-3"
                    >
                      {/* Nom + prix unitaire */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {cartItem.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {cartItem.price.toFixed(2).replace(".", ",")} &euro; / unite
                        </p>
                      </div>

                      {/* Total de la ligne */}
                      <span className="font-semibold text-gray-900 text-sm tabular-nums shrink-0 w-16 text-right">
                        {lineTotal}&nbsp;&euro;
                      </span>

                      {/* Controles quantite */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => onRemove(cartItem.menuItemId)}
                          className="w-7 h-7 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center transition-colors hover:bg-gray-200 active:scale-90"
                          aria-label={`Retirer un ${cartItem.name}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-3.5 h-3.5"
                          >
                            <path d="M5 12h14" />
                          </svg>
                        </button>

                        <span className="w-5 text-center font-semibold text-gray-900 text-sm tabular-nums">
                          {cartItem.quantity}
                        </span>

                        <button
                          onClick={() => menuItem && onAdd(menuItem)}
                          disabled={!menuItem}
                          className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center transition-all hover:bg-gray-700 active:scale-90 disabled:opacity-40"
                          aria-label={`Ajouter un ${cartItem.name}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-3.5 h-3.5"
                          >
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Separateur */}
              <div className="border-t border-gray-100 pt-3" />

              {/* Note pour la cuisine */}
              <div className="space-y-1.5">
                <label
                  htmlFor="cart-notes"
                  className="text-sm font-medium text-gray-700"
                >
                  Note pour la cuisine{" "}
                  <span className="text-gray-400 font-normal">(optionnel)</span>
                </label>
                <textarea
                  ref={textareaRef}
                  id="cart-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Allergie, sans sauce, cuisson..."
                  rows={2}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition placeholder:text-gray-300"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer : total + bouton commander */}
        {items.length > 0 && (
          <div className="px-4 pb-safe-area pb-4 pt-3 border-t border-gray-100 space-y-3 bg-white">
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Total</span>
              <span className="font-bold text-xl text-gray-900 tabular-nums">
                {totalFormatted}&nbsp;&euro;
              </span>
            </div>

            {/* CTA commande */}
            <button
              onClick={() => onOrder(notes)}
              disabled={isSubmitting || items.length === 0}
              className={[
                "w-full h-12 rounded-xl font-semibold text-base text-white",
                "transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900",
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-gray-700 active:scale-[0.98] shadow-md hover:shadow-lg",
              ].join(" ")}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Envoi en cours...
                </span>
              ) : (
                "Commander — Payer avec le serveur"
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
