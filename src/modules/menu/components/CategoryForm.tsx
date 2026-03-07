"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import type { MenuCategory } from "@/shared/types";

interface CategoryFormProps {
  restaurantId: string;
  category?: MenuCategory;
  onSave: () => void;
  onCancel: () => void;
}

export function CategoryForm({ restaurantId, category, onSave, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [sortOrder, setSortOrder] = useState(category?.sort_order ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Le nom est requis");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        restaurant_id: restaurantId,
        name: name.trim(),
        description: description.trim() || null,
        sort_order: sortOrder,
      };

      const res = category
        ? await fetch(`/api/menu/categories/${category.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/menu/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Erreur lors de la sauvegarde");
      }

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Nom */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-foreground" htmlFor="cat-name">
          Nom <span className="text-destructive">*</span>
        </label>
        <input
          id="cat-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Entrees, Plats, Desserts..."
          required
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-foreground" htmlFor="cat-desc">
          Description <span className="text-muted-foreground text-xs">(optionnelle)</span>
        </label>
        <textarea
          id="cat-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="Courte description de la categorie..."
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      {/* Ordre */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-foreground" htmlFor="cat-order">
          Ordre d&apos;affichage{" "}
          <span className="text-muted-foreground text-xs">(0 = premier)</span>
        </label>
        <input
          id="cat-order"
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
          min={0}
          className="w-32 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Sauvegarde..." : category ? "Mettre a jour" : "Creer la categorie"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
