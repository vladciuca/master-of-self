import React from "react";
import { Skeleton } from "../ui/skeleton";

const SkeletonList = () => {
  return (
    <div className="mx-8">
      <Skeleton className="h-4 w-full rounded-sm mb-6" />
      <Skeleton className="h-4 w-full rounded-sm mb-6" />
      <Skeleton className="h-4 w-full rounded-sm mb-6" />
      <Skeleton className="h-4 w-full rounded-sm mb-6" />
    </div>
  );
};

export default SkeletonList;
