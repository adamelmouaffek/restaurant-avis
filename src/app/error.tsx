"use client";

import Link from "next/link";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-dvh bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md mx-auto text-center space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-8 sm:p-10 space-y-6">
          {/* Error icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-red-50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10 sm:w-12 sm:h-12 text-red-500"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Une erreur est survenue
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Quelque chose ne s&apos;est pas passe comme prevu.
              Veuillez reessayer ou revenir a l&apos;accueil.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-gray-900 text-white font-semibold text-base shadow-md transition-all duration-200 hover:bg-gray-800 hover:shadow-lg active:scale-[0.98]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
              </svg>
              Reessayer
            </button>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold text-base shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md active:scale-[0.98]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Retour a l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
