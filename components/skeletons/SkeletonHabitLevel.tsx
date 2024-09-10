import { Skeleton } from "@components/ui/skeleton";

const SkeletonHabitLevel = () => {
  return (
    <div className="mx-12 mt-10">
      <div className="flex justify-around items-center my-8">
        <Skeleton className="h-8 w-8 rounded-full mb-10" />
        <Skeleton className="h-24 w-24 rounded-full mb-10" />
        <Skeleton className="h-8 w-8 rounded-full mb-10" />
      </div>
      <div className="flex justify-around items-center my-8">
        <Skeleton className="h-8 w-8 rounded-full mb-10" />
        <Skeleton className="h-24 w-24 rounded-full mb-10" />
        <Skeleton className="h-8 w-8 rounded-full mb-10" />
      </div>
      <div className="flex justify-around items-center my-8">
        <Skeleton className="h-8 w-8 rounded-full mb-10" />
        <Skeleton className="h-24 w-24 rounded-full mb-10" />
        <Skeleton className="h-8 w-8 rounded-full mb-10" />
      </div>
    </div>
  );
};

export default SkeletonHabitLevel;
