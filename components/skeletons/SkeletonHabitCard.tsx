import { Card } from "@components/ui/card";
import { Skeleton } from "@components/ui/skeleton";

export function SkeletonHabitCard() {
  return (
    <Card className="mt-1 mb-12 px-1 border-none">
      <div className="flex justify-between items-center">
        <Skeleton className="w-16 h-16" />
        <div className="flex flex-grow flex-col ml-6">
          <Skeleton className="rounded-md h-4 w-1/6 mb-4" />
          <Skeleton className="rounded-md h-4 w-1/2" />
        </div>

        <Skeleton className="rounded-full h-16 w-16" />
      </div>
    </Card>
  );
}
