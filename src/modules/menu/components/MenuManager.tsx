"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import type { MenuCategory, MenuItem } from "@/shared/types";
import { CategoryForm } from "./CategoryForm";
import { MenuItemForm } from "./MenuItemForm";

interface MenuManagerProps {
  restaurantId: string;
}

export function MenuManager({ restaurantId }: MenuManagerProps) {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [catRes, itemRes] = await Promise.all([
        fetch(`/api/menu/categories?restaurant_id=${restaurantId}`),
        fetch(`/api/menu/items?restaurant_id=${restaurantId}`),
      ]);

      if (!catRes.ok || !itemRes.ok) {
        throw new Error("Erreur lors du chargement des donnees");
      }

      const [cats, its] = await Promise.all([catRes.json(), itemRes.json()]);
      setCategories(cats);
      setItems(its);

      // Auto-select first category if none selected
      if (!selectedCategory && cats.length > 0) {
        setSelectedCategory(cats[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [restaurantId, selectedCategory]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId]);

  const toggleItemAvailability = async (id: string, current: boolean) => {
    // Optimistic update
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_available: !current } : item))
    );
    try {
      const res = await fetch(`/api/menu/items/${id}/availability`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_available: !current }),
      });
      if (!res.ok) {
        // Rollback
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, is_available: current } : item))
        );
        throw new Error("Echec de la mise a jour");
      }
    } catch {
      alert("Impossible de modifier la disponibilite");
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Supprimer cette categorie ? Les articles associes seront egalement supprimes."))
      return;
    try {
      const res = await fetch(`/api/menu/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Echec de la suppression");
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setItems((prev) => prev.filter((i) => i.category_id !== id));
      if (selectedCategory === id) {
        const remaining = categories.filter((c) => c.id !== id);
        setSelectedCategory(remaining.length > 0 ? remaining[0].id : null);
      }
    } catch {
      alert("Impossible de supprimer la categorie");
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Supprimer cet article ?")) return;
    try {
      const res = await fetch(`/api/menu/items/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Echec de la suppression");
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      alert("Impossible de supprimer l'article");
    }
  };

  const handleSave = () => {
    setShowCategoryForm(false);
    setShowItemForm(false);
    setEditingCategory(null);
    setEditingItem(null);
    loadData();
  };

  const handleCancel = () => {
    setShowCategoryForm(false);
    setShowItemForm(false);
    setEditingCategory(null);
    setEditingItem(null);
  };

  const filteredItems = selectedCategory
    ? items.filter((i) => i.category_id === selectedCategory)
    : [];

  const currentCategory = categories.find((c) => c.id === selectedCategory);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-56 bg-gray-200 rounded" />
        <div className="grid grid-cols-4 gap-4">
          <div className="h-64 bg-gray-100 rounded-xl" />
          <div className="col-span-3 h-64 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        <p className="font-medium">Erreur de chargement</p>
        <p className="text-sm mt-1">{error}</p>
        <Button variant="outline" size="sm" className="mt-3" onClick={loadData}>
          Reessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion du menu</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {categories.length} categorie{categories.length !== 1 ? "s" : ""} ·{" "}
            {items.length} article{items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCategory(null);
            setShowCategoryForm(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle categorie
        </Button>
      </div>

      {/* Category Form (inline) */}
      {(showCategoryForm || editingCategory) && (
        <div className="rounded-xl border bg-white shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingCategory ? "Modifier la categorie" : "Nouvelle categorie"}
          </h2>
          <CategoryForm
            restaurantId={restaurantId}
            category={editingCategory ?? undefined}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Item Form (inline) */}
      {(showItemForm || editingItem) && (
        <div className="rounded-xl border bg-white shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingItem ? "Modifier l'article" : "Nouvel article"}
          </h2>
          <MenuItemForm
            restaurantId={restaurantId}
            categories={categories}
            item={editingItem ?? undefined}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Panel */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-muted/30">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Categories
              </p>
            </div>
            {categories.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                Aucune categorie.
                <br />
                Cliquez sur &quot;+ Nouvelle categorie&quot;
              </div>
            ) : (
              <ul className="divide-y">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                        selectedCategory === cat.id
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <ChevronRight
                          className={`h-4 w-4 flex-shrink-0 transition-transform ${
                            selectedCategory === cat.id ? "rotate-90 text-primary" : "text-muted-foreground"
                          }`}
                        />
                        <span className="truncate">{cat.name}</span>
                      </span>
                      <span className="flex items-center gap-1 ml-2 flex-shrink-0">
                        <button
                          title="Modifier"
                          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingCategory(cat);
                            setShowCategoryForm(false);
                            setShowItemForm(false);
                            setEditingItem(null);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          title="Supprimer"
                          className="p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCategory(cat.id);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Items Panel */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b bg-muted/30">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {currentCategory ? currentCategory.name : "Articles"}
                {selectedCategory && (
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    ({filteredItems.length})
                  </span>
                )}
              </p>
              {selectedCategory && (
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingItem(null);
                    setShowItemForm(true);
                    setShowCategoryForm(false);
                    setEditingCategory(null);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Nouvel article
                </Button>
              )}
            </div>

            {!selectedCategory ? (
              <div className="p-12 text-center text-muted-foreground text-sm">
                Selectionnez une categorie pour voir ses articles
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground text-sm">
                Aucun article dans cette categorie.
                <br />
                Cliquez sur &quot;+ Nouvel article&quot; pour commencer.
              </div>
            ) : (
              <ul className="divide-y">
                {filteredItems.map((item) => (
                  <li key={item.id} className="flex items-center gap-4 px-4 py-3">
                    {/* Image thumbnail */}
                    {item.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-12 w-12 rounded-lg object-cover flex-shrink-0 border"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 text-muted-foreground text-xs">
                        Img
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{item.name}</span>
                        {item.allergens && item.allergens.length > 0 && (
                          <Badge variant="outline" className="text-xs flex-shrink-0">
                            {item.allergens.length} allergene{item.allergens.length > 1 ? "s" : ""}
                          </Badge>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {item.description}
                        </p>
                      )}
                      <p className="text-sm font-semibold text-primary mt-1">
                        {item.price.toFixed(2)} €
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Quick 86 Toggle */}
                      <button
                        title={item.is_available ? "Disponible — cliquer pour marquer epuise (86)" : "Epuise (86) — cliquer pour remettre disponible"}
                        onClick={() => toggleItemAvailability(item.id, item.is_available)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                          item.is_available
                            ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                            : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                        }`}
                      >
                        {item.is_available ? (
                          <ToggleRight className="h-4 w-4" />
                        ) : (
                          <ToggleLeft className="h-4 w-4" />
                        )}
                        {item.is_available ? "Dispo" : "86 - Epuise"}
                      </button>

                      <button
                        title="Modifier"
                        className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setEditingItem(item);
                          setShowItemForm(false);
                          setShowCategoryForm(false);
                          setEditingCategory(null);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        title="Supprimer"
                        className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
