import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonBarChart } from "./SkeletonBarChart";

export function SkeletonUserProfile() {
  return (
    <div className="flex flex-col h-full justify-between px-0">
      {/* Profile Info Section */}
      <div className="ml-3 space-y-3 text-center">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="space-y-6 sm:space-y-20 my-1">
        {/* Weekly Willpower Chart Section */}
        <SkeletonBarChart />
        {/* Habits Section */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 w-full max-w-full h-28">
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
      </div>

      <div className="space-y-5 mt-3 pl-2 pr-3">
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
