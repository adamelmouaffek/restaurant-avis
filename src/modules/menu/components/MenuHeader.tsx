"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Restaurant } from "@/shared/types";
import { getLabels } from "@/shared/lib/labels";

interface MenuHeaderProps {
  restaurant: Restaurant;
  tableNumber: string;
}

export default function MenuHeader({ restaurant, tableNumber }: MenuHeaderProps) {
  const router = useRouter();
  const labels = getLabels(restaurant.establishment_type);
  const [showPicker, setShowPicker] = useState(false);
  const [inputValue, setInputValue] = useState(tableNumber);
  const pickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close picker on outside click
  useEffect(() => {
    if (!showPicker) return;
    const handleClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showPicker]);

  // Focus input when picker opens
  useEffect(() => {
    if (showPicker && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [showPicker]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = inputValue.trim();
    if (!val) return;
    setShowPicker(false);
    if (val !== tableNumber) {
      router.push(`/m/${restaurant.slug}/table/${encodeURIComponent(val)}`);
    }
  };

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

        {/* Badge table — cliquable pour changer */}
        <div className="relative" ref={pickerRef}>
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="bg-white/10 text-white/80 text-sm font-medium px-3 py-1 rounded-full shrink-0 whitespace-nowrap hover:bg-white/20 transition-colors flex items-center gap-1.5"
          >
            {labels.table} {tableNumber}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`w-3 h-3 transition-transform ${showPicker ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Picker dropdown */}
          {showPicker && (
            <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-3 z-50 min-w-[200px]">
              <form onSubmit={handleSubmit}>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                  Numero de {labels.table.toLowerCase()}
                </label>
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 h-9 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Ex: 5"
                  />
                  <button
                    type="submit"
                    className="h-9 px-3 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors shrink-0"
                  >
                    OK
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
