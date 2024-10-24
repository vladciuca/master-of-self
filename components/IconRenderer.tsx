import React from "react";
import * as GiIcons from "react-icons/gi";
import { useIconRarityLevel } from "@hooks/useIconRarityLevel";
import { Skeleton } from "./ui/skeleton";

export type IconRendererProps = {
  iconName: string | null | undefined;
  className?: string;
  xp?: number;
  isXpLoading?: boolean;
};

export function IconRenderer({
  iconName,
  className = "",
  xp,
  isXpLoading,
}: IconRendererProps) {
  const { iconColorClass, bgColorClass } = useIconRarityLevel(xp);
  const Icon = GiIcons[iconName as keyof typeof GiIcons];

  if (!Icon) {
    console.warn(`Icon ${iconName} not found`);
    return null;
  }

  if (isXpLoading) return <Skeleton className={`${className}`} />;

  return (
    <div className={`${bgColorClass} ${className}`}>
      <Icon className={`${iconColorClass} h-full w-full`} />
    </div>
  );
}
