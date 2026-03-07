import { Skeleton } from "@/shared/components/ui/skeleton";

export default function ReviewsLoading() {
  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-4 w-48 mt-2" />
      </div>

      {/* Average rating card skeleton */}
      <div className="rounded-xl border bg-white shadow-sm p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="p-6 pb-4">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4"><Skeleton className="h-4 w-12" /></th>
                <th className="p-4"><Skeleton className="h-4 w-16" /></th>
                <th className="p-4"><Skeleton className="h-4 w-12" /></th>
                <th className="p-4 hidden md:table-cell"><Skeleton className="h-4 w-24" /></th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b last:border-b-0">
                  <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                  <td className="p-4"><Skeleton className="h-4 w-28" /></td>
                  <td className="p-4">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Skeleton key={j} className="h-4 w-4 rounded-sm" />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell"><Skeleton className="h-4 w-48" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
