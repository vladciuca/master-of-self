import React from "react";
import * as GiIcons from "react-icons/gi";
import * as FaIcons from "react-icons/fa6";
import { useIconRarityLevel } from "@hooks/useIconRarityLevel";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@lib/utils";

export type IconRendererProps = {
  iconName: string | null | undefined;
  size?: number;
  className?: string;
  xp?: number;
  isXpLoading?: boolean;
};

export function IconRenderer({
  iconName,
  size = 25,
  className = "",
  xp,
  isXpLoading,
}: IconRendererProps) {
  const { iconColorClass, bgColorClass } = useIconRarityLevel(xp);
  const Icon =
    GiIcons[iconName as keyof typeof GiIcons] ||
    FaIcons[iconName as keyof typeof FaIcons];

  if (!Icon) {
    console.warn(`Icon ${iconName} not found`);
    return null;
  }

  if (isXpLoading) return <Skeleton className={cn(className)} />;

  return (
    <div
      className={cn(
        bgColorClass,
        className,
        "flex items-center justify-center"
      )}
    >
      <Icon className={cn(iconColorClass)} size={Number(size)} />
    </div>
  );
}
