import { Skeleton } from "@components/ui/skeleton";

export function PagesOverviewSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2].map((section) => (
        <div key={section}>
          <div className="flex items-center justify-between mt-4 mb-6 bg-muted/30 rounded-lg p-2 px-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-10" />
          </div>
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 p-4 mb-3">
              <Skeleton className="h-14 w-14 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2 min-w-0">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-6 w-10 rounded-full flex-shrink-0" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
