import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonForm() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col items-center">
        <Skeleton className="rounded-full h-[85px] w-[85px] mt-20" />
      </div>
      <div className="flex flex-grow flex-col justify-between mb-24">
        <div className="flex flex-col items-center mt-10">
          <Skeleton className="w-full h-[35px]" />
          <Skeleton className="w-full h-[100px] mt-4" />
        </div>

        <div className="flex flex-col items-center mt-auto">
          <Skeleton className="w-full h-[42px]" />
          <Skeleton className="w-full h-[42px] mt-4" />
        </div>
      </div>
    </div>
  );
}
