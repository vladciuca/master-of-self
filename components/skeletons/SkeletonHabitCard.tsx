import { Card } from "@components/ui/card";
import { Skeleton } from "@components/ui/skeleton";

export function SkeletonHabitCard() {
  return (
    <Card className="my-4 p-4">
      <div className="flex justify-between items-center">
        <Skeleton className="w-1/2 h-8" />
        <Skeleton className="rounded-full h-16 w-16" />
      </div>
    </Card>
  );
}
