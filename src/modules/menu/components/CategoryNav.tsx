"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { MenuCategory } from "@/shared/types";

interface CategoryNavProps {
  categories: MenuCategory[];
  primaryColor?: string;
}

export default function CategoryNav({ categories, primaryColor = "#1a1a1a" }: CategoryNavProps) {
  const [activeId, setActiveId] = useState<string>(categories[0]?.id ?? "");
  const navRef = useRef<HTMLDivElement>(null);
  // Flag pour eviter le re-trigger de l'observer apres un clic
  const isScrollingByClick = useRef(false);

  // Scroll vers une categorie au clic
  const handleCategoryClick = useCallback((categoryId: string) => {
    isScrollingByClick.current = true;
    setActiveId(categoryId);

    const el = document.getElementById(`cat-${categoryId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Relache le flag apres la fin du scroll (approximativement)
    setTimeout(() => {
      isScrollingByClick.current = false;
    }, 800);
  }, []);

  // Auto-scroll du nav pour garder le bouton actif visible
  useEffect(() => {
    if (!navRef.current || !activeId) return;
    const activeBtn = navRef.current.querySelector<HTMLButtonElement>(
      `[data-cat-id="${activeId}"]`
    );
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeId]);

  // IntersectionObserver : detecte la categorie visible dans le viewport
  useEffect(() => {
    if (categories.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Ignore si l'utilisateur vient de cliquer sur un bouton
        if (isScrollingByClick.current) return;

        // Trouve la premiere section qui entre dans le viewport
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          const id = visible[0].target.id.replace("cat-", "");
          setActiveId(id);
        }
      },
      {
        // Declenche quand la section atteint le haut (sous les deux barres sticky)
        rootMargin: "-136px 0px -60% 0px",
        threshold: 0,
      }
    );

    categories.forEach((cat) => {
      const el = document.getElementById(`cat-${cat.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categories]);

  if (categories.length === 0) return null;

  return (
    <nav
      className="bg-white border-b border-gray-100 sticky top-[64px] z-30"
      aria-label="Categories du menu"
    >
      <div
        ref={navRef}
        className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-hide"
        style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
      >
        {categories.map((cat) => {
          const isActive = cat.id === activeId;
          return (
            <button
              key={cat.id}
              data-cat-id={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="shrink-0 h-8 px-4 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              style={
                isActive
                  ? { backgroundColor: primaryColor, color: "#ffffff" }
                  : { backgroundColor: "#f3f4f6", color: "#374151" }
              }
              aria-current={isActive ? "true" : undefined}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
