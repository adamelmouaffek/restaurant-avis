"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Pencil,
  Eye,
  EyeOff,
  ToggleLeft,
  ToggleRight,
  X,
  Loader2,
  Users,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface StaffMember {
  id: string;
  name: string;
  role: "waiter" | "manager" | "kitchen";
  is_active: boolean;
  created_at: string;
}

const ROLE_LABELS: Record<string, string> = {
  waiter: "Serveur",
  manager: "Manager",
  kitchen: "Cuisine",
};

const ROLE_BADGE_CLASSES: Record<string, string> = {
  waiter: "bg-blue-100 text-blue-700 border-blue-200",
  manager: "bg-purple-100 text-purple-700 border-purple-200",
  kitchen: "bg-orange-100 text-orange-700 border-orange-200",
};

interface StaffFormData {
  name: string;
  pin: string;
  role: "waiter" | "manager" | "kitchen";
}

export function StaffManager() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<StaffFormData>({
    name: "",
    pin: "",
    role: "waiter",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [revealedPins, setRevealedPins] = useState<Set<string>>(new Set());

  const loadStaff = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/staff");
      if (!res.ok) throw new Error("Erreur lors du chargement");
      const data = await res.json();
      setStaff(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  const resetForm = () => {
    setFormData({ name: "", pin: "", role: "waiter" });
    setFormError(null);
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError("Le nom est requis");
      return;
    }

    if (!editingId && (!/^\d{4}$/.test(formData.pin))) {
      setFormError("Le PIN doit contenir exactement 4 chiffres");
      return;
    }

    if (editingId && formData.pin && !/^\d{4}$/.test(formData.pin)) {
      setFormError("Le PIN doit contenir exactement 4 chiffres");
      return;
    }

    setSubmitting(true);

    try {
      if (editingId) {
        // Update
        const payload: Record<string, unknown> = {
          name: formData.name.trim(),
          role: formData.role,
        };
        if (formData.pin) payload.pin = formData.pin;

        const res = await fetch(`/api/dashboard/staff/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Erreur lors de la mise a jour");
        }
      } else {
        // Create
        const res = await fetch("/api/dashboard/staff", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name.trim(),
            pin: formData.pin,
            role: formData.role,
          }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Erreur lors de la creation");
        }
      }

      resetForm();
      loadStaff();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (member: StaffMember) => {
    const newActive = !member.is_active;
    // Optimistic
    setStaff((prev) =>
      prev.map((s) => (s.id === member.id ? { ...s, is_active: newActive } : s))
    );

    try {
      const res = await fetch(`/api/dashboard/staff/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: newActive }),
      });
      if (!res.ok) {
        // Rollback
        setStaff((prev) =>
          prev.map((s) =>
            s.id === member.id ? { ...s, is_active: !newActive } : s
          )
        );
      }
    } catch {
      setStaff((prev) =>
        prev.map((s) =>
          s.id === member.id ? { ...s, is_active: !newActive } : s
        )
      );
    }
  };

  const startEdit = (member: StaffMember) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      pin: "",
      role: member.role,
    });
    setShowForm(true);
    setFormError(null);
  };

  const togglePinReveal = (id: string) => {
    setRevealedPins((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="h-64 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        <p className="font-medium">Erreur de chargement</p>
        <p className="text-sm mt-1">{error}</p>
        <Button variant="outline" size="sm" className="mt-3" onClick={loadStaff}>
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
          <h1 className="text-2xl font-bold text-foreground">Gestion de l&apos;equipe</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {staff.length} membre{staff.length !== 1 ? "s" : ""} ·{" "}
            {staff.filter((s) => s.is_active).length} actif
            {staff.filter((s) => s.is_active).length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-xl border bg-white shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {editingId ? "Modifier le membre" : "Nouveau membre"}
            </h2>
            <button
              onClick={resetForm}
              className="p-1.5 rounded hover:bg-muted text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Ex: Marie"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  PIN (4 chiffres){editingId && " — laisser vide pour garder"}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={formData.pin}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                    setFormData((prev) => ({ ...prev, pin: val }));
                  }}
                  placeholder={editingId ? "****" : "1234"}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono tracking-widest"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      role: e.target.value as "waiter" | "manager" | "kitchen",
                    }))
                  }
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="waiter">Serveur</option>
                  <option value="manager">Manager</option>
                  <option value="kitchen">Cuisine</option>
                </select>
              </div>
            </div>

            {formError && (
              <p className="text-sm text-destructive">{formError}</p>
            )}

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingId ? "Enregistrer" : "Ajouter"}
              </Button>
              <Button type="button" variant="ghost" onClick={resetForm}>
                Annuler
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Staff table */}
      {staff.length === 0 ? (
        <div className="rounded-xl border bg-white shadow-sm p-12 text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Aucun membre pour le moment.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Cliquez sur &quot;Ajouter&quot; pour creer votre premier membre.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">
                    Nom
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">
                    Role
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">
                    PIN
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">
                    Statut
                  </th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {staff.map((member) => (
                  <tr key={member.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm font-medium ${
                          member.is_active
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {member.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full border ${
                          ROLE_BADGE_CLASSES[member.role]
                        }`}
                      >
                        {ROLE_LABELS[member.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-mono text-muted-foreground">
                          {revealedPins.has(member.id) ? "----" : "****"}
                        </span>
                        <button
                          onClick={() => togglePinReveal(member.id)}
                          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                          title={
                            revealedPins.has(member.id)
                              ? "Masquer le PIN"
                              : "Le PIN est chiffre, reinitialiser via Modifier"
                          }
                        >
                          {revealedPins.has(member.id) ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(member)}
                        className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border transition-colors ${
                          member.is_active
                            ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                            : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {member.is_active ? (
                          <ToggleRight className="h-4 w-4" />
                        ) : (
                          <ToggleLeft className="h-4 w-4" />
                        )}
                        {member.is_active ? "Actif" : "Inactif"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => startEdit(member)}
                        className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                        title="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
