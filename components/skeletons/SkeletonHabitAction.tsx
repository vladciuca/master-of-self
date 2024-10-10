import { Card } from "@components/ui/card";
import { Skeleton } from "@components/ui/skeleton";

export function SkeletonHabitAction() {
  return (
    <Card className="mt-2 mb-8 p-4 border-none mx-1">
      <div className="flex justify-between items-center">
        <Skeleton className="rounded-full h-16 w-16" />
        <Skeleton className="w-1/2 h-8" />
      </div>
    </Card>
  );
}
