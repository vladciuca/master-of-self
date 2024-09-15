import { Skeleton } from "@components/ui/skeleton";

export function SkeletonHabitLevel() {
  const skeletonLevel = Array.from({ length: 3 }, (_, index) => (
    <div key={index} className="flex justify-around items-center mb-8">
      <Skeleton className="h-8 w-8 rounded-md mb-10" />
      <Skeleton className="h-32 w-32 rounded-full mb-10" />
      <Skeleton className="h-8 w-8 rounded-md mb-10" />
    </div>
  ));

  return <div className="mx-12 mt-4">{skeletonLevel}</div>;
}
