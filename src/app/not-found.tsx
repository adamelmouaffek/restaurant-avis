import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-dvh bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md mx-auto text-center space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-8 sm:p-10 space-y-6">
          {/* Illustration SVG */}
          <div className="flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 120 120"
              fill="none"
              className="w-28 h-28 sm:w-32 sm:h-32"
            >
              {/* Circle background */}
              <circle cx="60" cy="60" r="56" fill="#FEF3C7" />
              {/* Map pin body */}
              <path
                d="M60 28c-12.15 0-22 9.85-22 22 0 16.5 22 38 22 38s22-21.5 22-38c0-12.15-9.85-22-22-22z"
                fill="#F59E0B"
                stroke="#D97706"
                strokeWidth="2"
              />
              {/* Inner circle on pin */}
              <circle cx="60" cy="50" r="9" fill="white" />
              {/* Question mark */}
              <text
                x="60"
                y="55"
                textAnchor="middle"
                fontFamily="sans-serif"
                fontSize="14"
                fontWeight="bold"
                fill="#D97706"
              >
                ?
              </text>
            </svg>
          </div>

          {/* 404 label */}
          <div className="space-y-1">
            <span className="text-5xl sm:text-6xl font-extrabold text-gray-200 select-none">
              404
            </span>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Page introuvable
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              La page que vous recherchez n&apos;existe pas ou a pu
              etre deplacee.
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
