"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = document.cookie
      .split("; ")
      .find((c) => c.startsWith("cookie_consent="));
    if (!consent) {
      setVisible(true);
    }
  }, []);

  function accept() {
    document.cookie =
      "cookie_consent=accepted; path=/; max-age=31536000; SameSite=Lax";
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4">
      <div className="max-w-2xl mx-auto bg-[#1E293B] border border-white/10 rounded-xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <p className="text-white/80 text-sm flex-1">
          Ce site utilise uniquement des cookies necessaires au fonctionnement du service
          (authentification, sessions). Aucun cookie publicitaire.{" "}
          <Link
            href="/confidentialite#cookies"
            className="text-blue-400 hover:underline"
          >
            En savoir plus
          </Link>
        </p>
        <button
          onClick={accept}
          className="shrink-0 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
        >
          Compris
        </button>
      </div>
    </div>
  );
}
