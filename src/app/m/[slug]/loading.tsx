export default function MenuLoading() {
  return (
    <main className="min-h-dvh bg-gray-50">
      {/* Skeleton header */}
      <div className="bg-white shadow-sm sticky top-0 z-40 px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse shrink-0" />
        <div className="flex-1 space-y-1">
          <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-7 w-20 bg-gray-100 rounded-full animate-pulse" />
      </div>

      {/* Skeleton category nav */}
      <div className="bg-white border-b sticky top-[64px] z-30 px-4 py-2 flex gap-2 overflow-hidden">
        {[80, 100, 70, 90].map((w, i) => (
          <div
            key={i}
            className="h-8 rounded-full bg-gray-200 animate-pulse shrink-0"
            style={{ width: `${w}px` }}
          />
        ))}
      </div>

      {/* Skeleton items */}
      <div className="px-4 py-6 space-y-8 max-w-2xl mx-auto">
        {[1, 2].map((section) => (
          <div key={section} className="space-y-4">
            {/* Titre de categorie */}
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />

            {/* Cards */}
            {[1, 2, 3].map((card) => (
              <div
                key={card}
                className="bg-white rounded-xl p-4 flex gap-3 shadow-sm"
              >
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
                  <div className="h-5 w-16 bg-gray-200 rounded animate-pulse mt-2" />
                </div>
                {/* Image placeholder */}
                <div className="w-24 h-24 rounded-lg bg-gray-200 animate-pulse shrink-0" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
