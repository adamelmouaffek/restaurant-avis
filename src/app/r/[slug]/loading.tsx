import { Skeleton } from "@/shared/components/ui/skeleton";

export default function RestaurantLoading() {
  return (
    <main className="min-h-dvh bg-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md mx-auto flex flex-col items-center gap-8 text-center">
        {/* Logo skeleton */}
        <div className="space-y-4">
          <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl mx-auto" />
          <Skeleton className="h-8 w-48 mx-auto rounded-lg" />
        </div>

        {/* Text skeletons */}
        <div className="space-y-3 w-full">
          <Skeleton className="h-5 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-full mx-auto" />
          <Skeleton className="h-4 w-5/6 mx-auto" />
        </div>

        {/* Gift icon skeleton */}
        <Skeleton className="w-16 h-16 rounded-full" />

        {/* CTA skeleton */}
        <Skeleton className="h-14 w-full max-w-[280px] rounded-2xl" />

        {/* Footer text skeleton */}
        <Skeleton className="h-3 w-32 mx-auto mt-4" />
      </div>
    </main>
  );
}
