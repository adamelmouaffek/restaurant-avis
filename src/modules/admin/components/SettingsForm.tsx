"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Settings, Loader2, Check } from "lucide-react";
import type { EstablishmentType } from "@/shared/types";

interface SettingsFormProps {
  restaurant: {
    id: string;
    name: string;
    establishment_type: EstablishmentType;
    google_maps_url: string | null;
    logo_url: string | null;
    primary_color: string | null;
  };
}

export function SettingsForm({ restaurant }: SettingsFormProps) {
  const router = useRouter();
  const [name, setName] = useState(restaurant.name);
  const [establishmentType, setEstablishmentType] = useState<EstablishmentType>(restaurant.establishment_type);
  const [googleMapsUrl, setGoogleMapsUrl] = useState(restaurant.google_maps_url || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/dashboard/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          establishment_type: establishmentType,
          google_maps_url: googleMapsUrl || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur lors de la sauvegarde");
        return;
      }

      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Erreur de connexion au serveur");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reglages</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configurez votre etablissement
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Informations generales</CardTitle>
              <CardDescription>Modifiez les parametres de votre etablissement</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type d&apos;etablissement</Label>
              <select
                id="type"
                value={establishmentType}
                onChange={(e) => setEstablishmentType(e.target.value as EstablishmentType)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="restaurant">Restaurant</option>
                <option value="hotel">Hotel</option>
                <option value="cafe">Cafe</option>
                <option value="bar">Bar</option>
              </select>
              <p className="text-xs text-muted-foreground">
                Ce choix adapte les termes utilises dans toutes les interfaces (menu, serveur, cuisine, etc.)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="googleMapsUrl">Lien Google Maps (optionnel)</Label>
              <Input
                id="googleMapsUrl"
                type="url"
                placeholder="https://maps.google.com/..."
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Les clients avec 4+ etoiles seront invites a laisser un avis Google
              </p>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : saved ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : null}
                {saved ? "Enregistre" : "Enregistrer"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
