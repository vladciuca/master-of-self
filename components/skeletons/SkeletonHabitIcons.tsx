import { Skeleton } from "@components/ui/skeleton";

export function SkeletonHabitIcons() {
  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 w-full max-w-full h-20 sm:h-28">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="min-w-20 flex flex-col items-center space-y-2"
        >
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      ))}
    </div>
  );
}
