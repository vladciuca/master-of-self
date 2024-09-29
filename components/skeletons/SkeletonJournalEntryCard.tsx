import { Card, CardHeader, CardTitle } from "@components/ui/card";
import { Skeleton } from "@components/ui/skeleton";

export function SkeletonJournalEntryCard() {
  return (
    <Card className="mb-4">
      <CardHeader className="p-4">
        <CardTitle className="flex items-start">
          <Skeleton className="h-16 w-16 rounded-sm" />
          <Skeleton className="ml-6 w-2/3 h-[25px]" />
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
