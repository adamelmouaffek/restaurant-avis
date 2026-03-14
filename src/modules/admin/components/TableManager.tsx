"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Pencil,
  ToggleLeft,
  ToggleRight,
  X,
  Loader2,
  LayoutGrid,
  Users as UsersIcon,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { getLabels } from "@/shared/lib/labels";
import type { RestaurantTable, EstablishmentType } from "@/shared/types";

interface TableFormData {
  number: string;
  capacity: string;
}

interface TableManagerProps {
  establishmentType?: EstablishmentType;
}

export function TableManager({ establishmentType = "restaurant" }: TableManagerProps) {
  const labels = getLabels(establishmentType);
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TableFormData>({
    number: "",
    capacity: "4",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadTables = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/tables");
      if (!res.ok) throw new Error("Erreur lors du chargement");
      const data = await res.json();
      setTables(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTables();
  }, [loadTables]);

  const resetForm = () => {
    setFormData({ number: "", capacity: "4" });
    setFormError(null);
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.number.trim()) {
      setFormError("Le numero de table est requis");
      return;
    }

    const cap = parseInt(formData.capacity, 10);
    if (isNaN(cap) || cap < 1) {
      setFormError("La capacite doit etre un nombre positif");
      return;
    }

    setSubmitting(true);

    try {
      if (editingId) {
        const res = await fetch(`/api/dashboard/tables/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            number: formData.number.trim(),
            capacity: cap,
          }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Erreur lors de la mise a jour");
        }
      } else {
        const res = await fetch("/api/dashboard/tables", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            number: formData.number.trim(),
            capacity: cap,
          }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Erreur lors de la creation");
        }
      }

      resetForm();
      loadTables();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (table: RestaurantTable) => {
    const newActive = !table.is_active;
    // Optimistic
    setTables((prev) =>
      prev.map((t) => (t.id === table.id ? { ...t, is_active: newActive } : t))
    );

    try {
      const res = await fetch(`/api/dashboard/tables/${table.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: newActive }),
      });
      if (!res.ok) {
        setTables((prev) =>
          prev.map((t) =>
            t.id === table.id ? { ...t, is_active: !newActive } : t
          )
        );
      }
    } catch {
      setTables((prev) =>
        prev.map((t) =>
          t.id === table.id ? { ...t, is_active: !newActive } : t
        )
      );
    }
  };

  const startEdit = (table: RestaurantTable) => {
    setEditingId(table.id);
    setFormData({
      number: table.number,
      capacity: String(table.capacity || 4),
    });
    setShowForm(true);
    setFormError(null);
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        <p className="font-medium">Erreur de chargement</p>
        <p className="text-sm mt-1">{error}</p>
        <Button variant="outline" size="sm" className="mt-3" onClick={loadTables}>
          Reessayer
        </Button>
      </div>
    );
  }

  const activeTables = tables.filter((t) => t.is_active);
  const inactiveTables = tables.filter((t) => !t.is_active);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion des {labels.tables.toLowerCase()}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {tables.length} table{tables.length !== 1 ? "s" : ""} ·{" "}
            {activeTables.length} active{activeTables.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une table
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-xl border bg-white shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {editingId ? "Modifier la table" : "Nouvelle table"}
            </h2>
            <button
              onClick={resetForm}
              className="p-1.5 rounded hover:bg-muted text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Numero de table
                </label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, number: e.target.value }))
                  }
                  placeholder="Ex: 1, 2, T3, Terrasse..."
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Capacite (personnes)
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      capacity: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {formError && (
              <p className="text-sm text-destructive">{formError}</p>
            )}

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={submitting}>
                {submitting && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {editingId ? "Enregistrer" : "Ajouter"}
              </Button>
              <Button type="button" variant="ghost" onClick={resetForm}>
                Annuler
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tables grid */}
      {tables.length === 0 ? (
        <div className="rounded-xl border bg-white shadow-sm p-12 text-center">
          <LayoutGrid className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Aucune table pour le moment.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Cliquez sur &quot;Ajouter une table&quot; pour commencer.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active tables */}
          {activeTables.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Tables actives ({activeTables.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {activeTables.map((table) => (
                  <TableCard
                    key={table.id}
                    table={table}
                    onEdit={startEdit}
                    onToggleActive={toggleActive}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Inactive tables */}
          {inactiveTables.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Tables inactives ({inactiveTables.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {inactiveTables.map((table) => (
                  <TableCard
                    key={table.id}
                    table={table}
                    onEdit={startEdit}
                    onToggleActive={toggleActive}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- Table Card sub-component ---

interface TableCardProps {
  table: RestaurantTable;
  onEdit: (table: RestaurantTable) => void;
  onToggleActive: (table: RestaurantTable) => void;
}

function TableCard({ table, onEdit, onToggleActive }: TableCardProps) {
  return (
    <div
      className={`rounded-xl border bg-white shadow-sm p-4 flex flex-col transition-colors ${
        table.is_active ? "" : "opacity-60"
      }`}
    >
      {/* Table number */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl font-bold text-foreground">
          {table.number}
        </span>
        <span
          className={`w-3 h-3 rounded-full ${
            table.is_active ? "bg-green-500" : "bg-gray-300"
          }`}
        />
      </div>

      {/* Capacity */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
        <UsersIcon className="h-3.5 w-3.5" />
        <span>
          {table.capacity || "?"} personne{(table.capacity || 0) !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-auto">
        <button
          onClick={() => onToggleActive(table)}
          className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-colors ${
            table.is_active
              ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
              : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
          }`}
        >
          {table.is_active ? (
            <ToggleRight className="h-3.5 w-3.5" />
          ) : (
            <ToggleLeft className="h-3.5 w-3.5" />
          )}
          {table.is_active ? "Active" : "Inactive"}
        </button>

        <button
          onClick={() => onEdit(table)}
          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground ml-auto"
          title="Modifier"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
