"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import type { MenuCategory, MenuItem } from "@/shared/types";
import { ALLERGENS_EU } from "@/modules/menu/types";

interface MenuItemFormProps {
  restaurantId: string;
  categories: MenuCategory[];
  item?: MenuItem;
  onSave: () => void;
  onCancel: () => void;
}

export function MenuItemForm({
  restaurantId,
  categories,
  item,
  onSave,
  onCancel,
}: MenuItemFormProps) {
  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [categoryId, setCategoryId] = useState(item?.category_id ?? (categories[0]?.id ?? ""));
  const [price, setPrice] = useState(item?.price?.toString() ?? "");
  const [imageUrl, setImageUrl] = useState(item?.image_url ?? "");
  const [imagePreview, setImagePreview] = useState<string | null>(item?.image_url ?? null);
  const [isUploading, setIsUploading] = useState(false);
  const [allergens, setAllergens] = useState<string[]>(item?.allergens ?? []);
  const [isAvailable, setIsAvailable] = useState(item?.is_available ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Apercu local immediat
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    // Upload vers Supabase Storage
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/menu/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Erreur lors de l'upload");
      }

      const { url } = await res.json();
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur upload");
      setImagePreview(item?.image_url ?? null);
    } finally {
      setIsUploading(false);
    }
  };

  const toggleAllergen = (allergen: string) => {
    setAllergens((prev) =>
      prev.includes(allergen) ? prev.filter((a) => a !== allergen) : [...prev, allergen]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Le nom est requis");
      return;
    }
    if (!categoryId) {
      setError("La categorie est requise");
      return;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError("Le prix doit etre un nombre valide");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        restaurant_id: restaurantId,
        name: name.trim(),
        description: description.trim() || null,
        category_id: categoryId,
        price: parsedPrice,
        image_url: imageUrl.trim() || null,
        allergens,
        is_available: isAvailable,
      };

      const res = item
        ? await fetch(`/api/menu/items/${item.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/menu/items", {
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
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nom */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-foreground" htmlFor="item-name">
            Nom <span className="text-destructive">*</span>
          </label>
          <input
            id="item-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Entrecote grille..."
            required
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Categorie */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-foreground" htmlFor="item-cat">
            Categorie <span className="text-destructive">*</span>
          </label>
          <select
            id="item-cat"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {categories.length === 0 && (
              <option value="">Aucune categorie disponible</option>
            )}
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-foreground" htmlFor="item-desc">
          Description <span className="text-muted-foreground text-xs">(optionnelle)</span>
        </label>
        <textarea
          id="item-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="Ingredients, mode de cuisson..."
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Prix */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-foreground" htmlFor="item-price">
            Prix (€) <span className="text-destructive">*</span>
          </label>
          <input
            id="item-price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="0.01"
            min="0"
            placeholder="0.00"
            required
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Photo */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-foreground">
            Photo <span className="text-muted-foreground text-xs">(JPG, PNG, WebP — max 5 Mo)</span>
          </label>
          <div className="flex items-center gap-3">
            {/* Apercu */}
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center shrink-0 border border-input">
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="Apercu" className="w-full h-full object-cover" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6 text-muted-foreground">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              )}
            </div>
            <div className="flex-1 space-y-1">
              <label
                htmlFor="item-photo"
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-input text-sm cursor-pointer transition-colors hover:bg-muted/50 ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                {isUploading ? "Upload en cours..." : "Choisir une photo"}
              </label>
              <input
                id="item-photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                className="sr-only"
                disabled={isUploading}
              />
              {imagePreview && !isUploading && (
                <button
                  type="button"
                  onClick={() => { setImageUrl(""); setImagePreview(null); }}
                  className="text-xs text-destructive hover:underline"
                >
                  Supprimer la photo
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Disponibilite */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={isAvailable}
          onClick={() => setIsAvailable((v) => !v)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
            isAvailable ? "bg-primary" : "bg-muted-foreground/30"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
              isAvailable ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <label className="text-sm font-medium text-foreground cursor-pointer" onClick={() => setIsAvailable((v) => !v)}>
          Disponible a la commande
        </label>
      </div>

      {/* Allergenes */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Allergenes{" "}
          <span className="text-muted-foreground text-xs">(14 allergenes reglementaires UE)</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {ALLERGENS_EU.map((allergen) => {
            const checked = allergens.includes(allergen);
            return (
              <label
                key={allergen}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer text-sm transition-colors ${
                  checked
                    ? "border-primary bg-primary/5 text-primary font-medium"
                    : "border-input text-foreground hover:bg-muted/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleAllergen(allergen)}
                  className="sr-only"
                />
                <span
                  className={`h-4 w-4 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors ${
                    checked ? "border-primary bg-primary" : "border-muted-foreground/40"
                  }`}
                >
                  {checked && (
                    <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                {allergen}
              </label>
            );
          })}
        </div>
        {allergens.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            {allergens.length} allergene{allergens.length > 1 ? "s" : ""} selectionne{allergens.length > 1 ? "s" : ""} :{" "}
            {allergens.join(", ")}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-t">
        <Button type="submit" disabled={loading || isUploading || categories.length === 0}>
          {loading ? "Sauvegarde..." : item ? "Mettre a jour" : "Creer l'article"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
