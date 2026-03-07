import Link from "next/link";

export default function MenuNotFound() {
  return (
    <main className="min-h-dvh bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md mx-auto text-center space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-8 sm:p-10 space-y-6">
          {/* Icone restaurant */}
          <div className="flex justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-amber-50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500"
              >
                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" />
                <path d="M7 2v20" />
                <path d="M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
              </svg>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Restaurant introuvable
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Ce menu n&apos;existe pas ou n&apos;est pas encore disponible.
            </p>
            <p className="text-xs text-gray-400">
              Verifiez le lien ou scannez a nouveau le QR code de votre table.
            </p>
          </div>

          {/* CTA */}
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-gray-900 text-white font-semibold text-base shadow-md transition-all duration-200 hover:bg-gray-800 hover:shadow-lg active:scale-[0.98]"
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
    </main>
  );
}
