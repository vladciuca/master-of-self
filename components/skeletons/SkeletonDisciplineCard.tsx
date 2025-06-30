import { Card } from "@components/ui/card";
import { Skeleton } from "@components/ui/skeleton";

export function SkeletonDisciplineCard() {
  return (
    <Card className="flex flex-col items-start w-full p-4 border-none shadow-none">
      <Skeleton className="h-5 w-24 mb-4 mt-2" />
      <Skeleton className="h-4 w-full rounded-full mb-2" />
    </Card>
  );
}
