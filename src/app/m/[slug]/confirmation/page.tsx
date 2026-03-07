"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function ConfirmationContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("order_id");
  const tableNumber = searchParams.get("table_number") ?? "1";
  const totalRaw = searchParams.get("total");

  // Formater le montant en euros (total en centimes ou en euros selon l'API)
  const totalFormatted = totalRaw
    ? parseFloat(totalRaw).toFixed(2).replace(".", ",")
    : "0,00";

  return (
    <main className="min-h-dvh bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 text-center space-y-6">
          {/* Icone succes */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10 text-green-500"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>

          {/* Titre */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Commande envoyee !
            </h1>
            <p className="text-base font-medium text-gray-600">
              Table {tableNumber}&nbsp;&mdash;&nbsp;Total&nbsp;: {totalFormatted}&nbsp;&euro;
            </p>
          </div>

          {/* Message */}
          <p className="text-sm text-gray-500 leading-relaxed">
            Votre commande est en cours de preparation. Un serveur vous apportera vos plats.
          </p>

          {/* Numero de commande (subtil) */}
          {orderId && (
            <p className="text-xs text-gray-400">
              Ref. commande : {orderId.slice(0, 8).toUpperCase()}
            </p>
          )}

          {/* Separateur */}
          <div className="border-t border-gray-100" />

          {/* CTA retour menu */}
          <button
            onClick={() => router.push(`/m/${slug}?table=${tableNumber}`)}
            className="w-full h-12 rounded-xl bg-gray-900 text-white font-semibold text-base shadow-md transition-all duration-200 hover:bg-gray-800 hover:shadow-lg active:scale-[0.98]"
          >
            Commander a nouveau
          </button>
        </div>
      </div>
    </main>
  );
}

// Page wrapper — useSearchParams doit etre dans un Suspense boundary
interface PageProps {
  params: { slug: string };
}

export default function ConfirmationPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <main className="min-h-dvh bg-gray-50 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-gray-900 border-t-transparent animate-spin" />
        </main>
      }
    >
      <ConfirmationContent slug={params.slug} />
    </Suspense>
  );
}
