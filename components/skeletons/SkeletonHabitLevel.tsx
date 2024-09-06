import { Skeleton } from "@components/ui/skeleton";

const SkeletonHabitLevel = () => {
  return (
    <div className="mx-12 mt-20">
      <Skeleton className="h-8 w-full rounded-full mb-10" />
      <Skeleton className="h-8 w-full rounded-full mb-10" />
      <Skeleton className="h-8 w-full rounded-full mb-10" />
    </div>
  );
};

export default SkeletonHabitLevel;
