import React from "react";
import { Skeleton } from "@components/ui/skeleton";

const SkeletonList = () => {
  return (
    <div className="mx-6">
      <Skeleton className="h-4 w-full rounded-sm mb-6" />
      <Skeleton className="h-4 w-full rounded-sm mb-6" />
      <Skeleton className="h-4 w-full rounded-sm mb-6" />
    </div>
  );
};

export default SkeletonList;
