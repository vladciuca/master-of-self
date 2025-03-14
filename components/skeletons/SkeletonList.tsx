import { Skeleton } from "@components/ui/skeleton";

export function SkeletonList() {
  const skeletonListItem = Array.from({ length: 3 }, (_, index) => (
    <Skeleton key={index} className="h-4 w-full rounded-sm mb-6" />
  ));

  return <div className="mt-4 mx-4">{skeletonListItem}</div>;
}
