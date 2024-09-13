import { Card, CardHeader, CardTitle } from "@components/ui/card";
import { Skeleton } from "@components/ui/skeleton";

export function SkeletonJournalEntryCard() {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-start">
          <Skeleton className="h-16 w-16 rounded-sm mr-6" />
          <Skeleton className="w-full h-[25px]" />
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
