import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonBarChart() {
  const heights = [
    "h-[60px]",
    "h-[35px]",
    "h-[65px]",
    "h-[15px]",
    "h-[40px]",
    "h-[15px]",
    "h-[25px]",
  ];

  return (
    <div className="grid grid-cols-7 gap-4 items-end h-[100px] px-2 my-6">
      {heights.map((height, index) => (
        <Skeleton key={index} className={`w-[40px] ${height}`} />
      ))}
    </div>
  );
}
