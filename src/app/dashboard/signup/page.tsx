"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { UserPlus } from "lucide-react";

export default function DashboardSignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tableCount, setTableCount] = useState(6);
  const [firstServerName, setFirstServerName] = useState("");
  const [firstServerPin, setFirstServerPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit faire au moins 8 caracteres");
      return;
    }

    if (firstServerName && !/^\d{4}$/.test(firstServerPin)) {
      setError("Le PIN du serveur doit etre exactement 4 chiffres");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
          tableCount,
          firstServer: firstServerName
            ? { name: firstServerName, pin: firstServerPin }
            : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de l'inscription");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl">Creer votre restaurant</CardTitle>
          <CardDescription>
            Inscrivez-vous pour acceder a votre espace gerant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du restaurant</Label>
              <Input
                id="name"
                type="text"
                placeholder="Mon Restaurant"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="8 caracteres minimum"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Retapez votre mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tableCount">Nombre de tables</Label>
              <Input
                id="tableCount"
                type="number"
                min={1}
                max={50}
                value={tableCount}
                onChange={(e) => setTableCount(parseInt(e.target.value) || 1)}
              />
            </div>

            {/* Separator */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  Optionnel : Premier serveur
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="serverName">Nom du serveur</Label>
              <Input
                id="serverName"
                type="text"
                placeholder="Prenom du serveur"
                value={firstServerName}
                onChange={(e) => setFirstServerName(e.target.value)}
                maxLength={50}
              />
            </div>

            {firstServerName && (
              <div className="space-y-2">
                <Label htmlFor="serverPin">PIN du serveur (4 chiffres)</Label>
                <Input
                  id="serverPin"
                  type="text"
                  inputMode="numeric"
                  placeholder="1234"
                  value={firstServerPin}
                  onChange={(e) => setFirstServerPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  maxLength={4}
                />
              </div>
            )}

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creation en cours..." : "Creer mon restaurant"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Deja un compte ?{" "}
            <Link
              href="/dashboard/login"
              className="text-primary hover:underline font-medium"
            >
              Se connecter
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
