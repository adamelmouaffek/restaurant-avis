"use client";

import { useState, useEffect, useCallback } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Plus, QrCode, Download } from "lucide-react";
import type { QRCode as QRCodeType } from "@/shared/types";

interface QRCodeGeneratorProps {
  restaurantId: string;
  restaurantSlug: string;
}

export function QRCodeGenerator({
  restaurantId,
  restaurantSlug,
}: QRCodeGeneratorProps) {
  const [qrCodes, setQrCodes] = useState<QRCodeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableNumber, setTableNumber] = useState("");
  const [generating, setGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchQRCodes = useCallback(async () => {
    const res = await fetch(
      `/api/avis/qr-codes?restaurant_id=${restaurantId}`
    );
    const data = await res.json();
    setQrCodes(data);
    setLoading(false);
  }, [restaurantId]);

  useEffect(() => {
    fetchQRCodes();
  }, [fetchQRCodes]);

  const generateQRCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableNumber.trim()) return;

    setGenerating(true);
    try {
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/${restaurantSlug}?table=${tableNumber}`;

      await fetch("/api/avis/qr-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          table_number: tableNumber,
          url,
        }),
      });

      setTableNumber("");
      setShowForm(false);
      await fetchQRCodes();
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = (qr: QRCodeType) => {
    const svg = document.getElementById(`qr-${qr.id}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 300, 300);
        ctx.drawImage(img, 0, 0, 300, 300);
      }
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `qr-table-${qr.table_number}.png`;
      link.href = pngUrl;
      link.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
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
          <h1 className="text-2xl font-bold">QR Codes</h1>
          <p className="text-muted-foreground mt-1">
            Generez des QR codes pour vos tables
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Generer
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Nouveau QR Code</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={generateQRCode} className="flex gap-3 items-end">
              <div className="space-y-2 flex-1">
                <Label htmlFor="table">Numero de table</Label>
                <Input
                  id="table"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="Ex: 1, 2, Terrasse..."
                  required
                />
              </div>
              <Button type="submit" disabled={generating}>
                {generating ? "Generation..." : "Generer"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setTableNumber("");
                }}
              >
                Annuler
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* QR codes grid */}
      {qrCodes.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="py-12 text-center text-muted-foreground">
            Aucun QR code genere. Cliquez sur &quot;Generer&quot; pour
            commencer.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {qrCodes.map((qr) => (
            <Card key={qr.id} className="shadow-sm">
              <CardContent className="p-6 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">
                    Table {qr.table_number}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <QRCode
                    id={`qr-${qr.id}`}
                    value={qr.url}
                    size={160}
                    level="M"
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center break-all max-w-[200px]">
                  {qr.url}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(qr)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Telecharger PNG
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
