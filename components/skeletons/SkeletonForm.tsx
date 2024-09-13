import { Skeleton } from "@components/ui/skeleton";

export function SkeletonForm() {
  return (
    <div className="w-full flex flex-col space-y-8 my-10 h-full">
      <Skeleton className="w-1/3 h-[45px] mb-6" />

      <Skeleton className="w-full h-[35px]" />
      <Skeleton className="w-full h-[100px]" />

      <div className="flex flex-col flex-grow justify-center items-center">
        <Skeleton className="w-1/2 h-[42px] mt-6 mb-6" />
        <Skeleton className="w-1/2 h-[42px]" />
      </div>
    </div>
  );
}
