export default function KDSLoading() {
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-6 bg-gray-800 rounded-xl p-4 animate-pulse">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-gray-700 rounded" />
          <div className="h-4 w-32 bg-gray-700 rounded" />
        </div>
        <div className="h-8 w-24 bg-gray-700 rounded-full" />
      </div>

      {/* Filters skeleton */}
      <div className="flex gap-3 mb-6 bg-gray-800 rounded-xl p-3 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-9 w-32 bg-gray-700 rounded-lg" />
        ))}
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-800 border border-gray-700 rounded-xl p-4 animate-pulse space-y-4"
          >
            {/* Card header */}
            <div className="flex items-center justify-between">
              <div className="h-8 w-24 bg-gray-700 rounded" />
              <div className="h-6 w-20 bg-gray-700 rounded-full" />
            </div>

            {/* Items */}
            <div className="space-y-2">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex justify-between">
                  <div className="h-4 w-36 bg-gray-700 rounded" />
                  <div className="h-4 w-12 bg-gray-700 rounded" />
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-700">
              <div className="h-4 w-16 bg-gray-700 rounded" />
              <div className="h-9 w-28 bg-gray-700 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
