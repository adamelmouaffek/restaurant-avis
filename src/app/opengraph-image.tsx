import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Restaurant Avis — Suite digitale HoReCa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 16,
            background: "linear-gradient(135deg, #3B82F6, #60A5FA)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
            fontSize: 40,
          }}
        >
          ★
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "white",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Restaurant Avis
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.7)",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Multipliez vos avis Google avec la roue cadeaux
        </div>

        {/* Features */}
        <div
          style={{
            display: "flex",
            gap: 32,
            marginTop: 40,
          }}
        >
          {["Roue Cadeaux", "Menu QR", "Commandes", "KDS"].map((feat) => (
            <div
              key={feat}
              style={{
                padding: "10px 24px",
                borderRadius: 12,
                background: "rgba(59, 130, 246, 0.2)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                color: "#60A5FA",
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              {feat}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
