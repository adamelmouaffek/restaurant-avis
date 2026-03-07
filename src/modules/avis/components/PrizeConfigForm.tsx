"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import type { Prize } from "@/shared/types";

interface PrizeConfigFormProps {
  restaurantId: string;
}

interface PrizeFormData {
  name: string;
  description: string;
  probability: number;
  color: string;
  icon: string;
  is_active: boolean;
}

const defaultForm: PrizeFormData = {
  name: "",
  description: "",
  probability: 10,
  color: "#3b82f6",
  icon: "gift",
  is_active: true,
};

export function PrizeConfigForm({ restaurantId }: PrizeConfigFormProps) {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PrizeFormData>(defaultForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchPrizes = useCallback(async () => {
    const res = await fetch(`/api/avis/prizes?restaurant_id=${restaurantId}`);
    const data = await res.json();
    setPrizes(data);
    setLoading(false);
  }, [restaurantId]);

  useEffect(() => {
    fetchPrizes();
  }, [fetchPrizes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingId) {
        await fetch("/api/avis/prizes", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...form }),
        });
      } else {
        await fetch("/api/avis/prizes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ restaurant_id: restaurantId, ...form }),
        });
      }

      setShowForm(false);
      setEditingId(null);
      setForm(defaultForm);
      await fetchPrizes();
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (prize: Prize) => {
    setForm({
      name: prize.name,
      description: prize.description || "",
      probability: prize.probability,
      color: prize.color,
      icon: prize.icon,
      is_active: prize.is_active,
    });
    setEditingId(prize.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/avis/prizes?id=${id}`, { method: "DELETE" });
    setDeleteConfirm(null);
    await fetchPrizes();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(defaultForm);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Chargement...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cadeaux</h1>
          <p className="text-muted-foreground mt-1">
            Configurez les cadeaux de la roue
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">
              {editingId ? "Modifier le cadeau" : "Nouveau cadeau"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Ex: Dessert offert"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icone</Label>
                  <Input
                    id="icon"
                    value={form.icon}
                    onChange={(e) =>
                      setForm({ ...form, icon: e.target.value })
                    }
                    placeholder="Ex: gift, coffee, cake"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Description du cadeau..."
                  rows={2}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="probability">Probabilite (%)</Label>
                  <Input
                    id="probability"
                    type="number"
                    min={0}
                    max={100}
                    value={form.probability}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        probability: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Couleur</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={form.color}
                      onChange={(e) =>
                        setForm({ ...form, color: e.target.value })
                      }
                      className="w-14 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={form.color}
                      onChange={(e) =>
                        setForm({ ...form, color: e.target.value })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Statut</Label>
                  <div className="flex items-center gap-2 h-10">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) =>
                        setForm({ ...form, is_active: e.target.checked })
                      }
                      className="h-4 w-4 rounded"
                      id="is_active"
                    />
                    <Label htmlFor="is_active" className="font-normal">
                      Actif
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      {prizes.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="py-12 text-center text-muted-foreground">
            Aucun cadeau configure. Cliquez sur &quot;Ajouter&quot; pour commencer.
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Couleur
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Nom
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">
                    Description
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Probabilite
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Statut
                  </th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {prizes.map((prize) => (
                  <tr key={prize.id} className="border-b last:border-b-0">
                    <td className="p-4">
                      <div
                        className="h-8 w-8 rounded-full border"
                        style={{ backgroundColor: prize.color }}
                      />
                    </td>
                    <td className="p-4 font-medium">{prize.name}</td>
                    <td className="p-4 text-sm text-muted-foreground hidden sm:table-cell max-w-[200px] truncate">
                      {prize.description || "--"}
                    </td>
                    <td className="p-4 text-sm">{prize.probability}%</td>
                    <td className="p-4">
                      <Badge
                        variant={prize.is_active ? "default" : "secondary"}
                      >
                        {prize.is_active ? "Actif" : "Inactif"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(prize)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {deleteConfirm === prize.id ? (
                          <div className="flex gap-1">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(prize.id)}
                            >
                              Confirmer
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeleteConfirm(null)}
                            >
                              Non
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteConfirm(prize.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
