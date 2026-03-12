"use client";

import { useState, useRef } from "react";
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
import { Download, UtensilsCrossed } from "lucide-react";

interface MenuQRGeneratorProps {
  restaurantSlug: string;
}

interface TableQR {
  number: string;
  url: string;
}

export function MenuQRGenerator({ restaurantSlug }: MenuQRGeneratorProps) {
  const [tableCount, setTableCount] = useState("");
  const [tables, setTables] = useState<TableQR[]>([]);
  const qrContainerRef = useRef<HTMLDivElement>(null);

  const generateTables = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(tableCount);
    if (isNaN(count) || count < 1 || count > 100) return;

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const generated: TableQR[] = [];
    for (let i = 1; i <= count; i++) {
      generated.push({
        number: String(i),
        url: `${baseUrl}/m/${restaurantSlug}/table/${i}`,
      });
    }
    setTables(generated);
  };

  const downloadSingle = (table: TableQR) => {
    const svgElement = document.getElementById(`menu-qr-${table.number}`);
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 400;
      canvas.height = 480;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 400, 480);
        ctx.drawImage(img, 50, 20, 300, 300);
        // Label sous le QR
        ctx.fillStyle = "#111";
        ctx.font = "bold 28px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`Table ${table.number}`, 200, 370);
        ctx.font = "16px Inter, sans-serif";
        ctx.fillStyle = "#666";
        ctx.fillText("Scannez pour commander", 200, 400);
        ctx.font = "12px Inter, sans-serif";
        ctx.fillStyle = "#999";
        ctx.fillText(table.url, 200, 440);
      }
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `menu-qr-table-${table.number}.png`;
      link.href = pngUrl;
      link.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const downloadAll = async () => {
    for (const table of tables) {
      downloadSingle(table);
      // Petit delai pour eviter le blocage navigateur
      await new Promise((r) => setTimeout(r, 200));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <UtensilsCrossed className="h-5 w-5" />
          QR Codes Menu
        </h2>
        <p className="text-muted-foreground mt-1">
          Generez les QR codes pour le menu digital de chaque table
        </p>
      </div>

      {/* Formulaire */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Generation par lot</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={generateTables} className="flex gap-3 items-end">
            <div className="space-y-2 flex-1 max-w-[200px]">
              <Label htmlFor="table-count">Nombre de tables</Label>
              <Input
                id="table-count"
                type="number"
                min={1}
                max={100}
                value={tableCount}
                onChange={(e) => setTableCount(e.target.value)}
                placeholder="Ex: 10"
                required
              />
            </div>
            <Button type="submit">
              Generer les QR codes
            </Button>
            {tables.length > 0 && (
              <Button type="button" variant="outline" onClick={downloadAll}>
                <Download className="h-4 w-4 mr-2" />
                Tout telecharger
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Grille QR */}
      {tables.length > 0 && (
        <div ref={qrContainerRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tables.map((table) => (
            <Card key={table.number} className="shadow-sm">
              <CardContent className="p-4 flex flex-col items-center gap-3">
                <span className="font-bold text-lg">Table {table.number}</span>
                <div className="bg-white p-3 rounded-lg border">
                  <QRCode
                    id={`menu-qr-${table.number}`}
                    value={table.url}
                    size={140}
                    level="M"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground text-center break-all max-w-[180px]">
                  {table.url}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadSingle(table)}
                >
                  <Download className="h-3 w-3 mr-1" />
                  PNG
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tables.length === 0 && (
        <Card className="shadow-sm">
          <CardContent className="py-12 text-center text-muted-foreground">
            Entrez le nombre de tables et cliquez sur &quot;Generer&quot; pour creer les QR codes du menu.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
