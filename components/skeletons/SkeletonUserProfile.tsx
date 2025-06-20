import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonUserProfile() {
  return (
    <div className="flex flex-col h-full justify-between px-0">
      {/* Profile Info Section */}
      <div className="ml-3 space-y-2 text-center">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Weekly Willpower Chart Section */}
      {/* <div className="mb-4 sm:mb-8 px-4">
        <div className="space-y-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div> */}

      {/* Habits Section */}
      <div className="mt-8 flex gap-3 overflow-x-auto scrollbar-hide pb-2 w-full max-w-full h-28">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="min-w-20 flex flex-col items-center space-y-2"
          >
            <Skeleton className="h-12 w-12 rounded-full" />
            {/* <Skeleton className="h-3 w-12" /> */}
          </div>
        ))}
      </div>

      <div className="space-y-8 px-2">
        {[1, 2, 3].map((i) => (
          <div key={`skeleton-${i}`} className="flex items-center mb-3">
            <Skeleton className="h-8 w-8 rounded-full mr-2" />
            <div className="flex-1">
              <Skeleton className="h-8 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
