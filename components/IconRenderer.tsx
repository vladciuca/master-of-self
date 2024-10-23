import React from "react";
import * as GiIcons from "react-icons/gi";
import { useIconRarityLevel } from "@hooks/useIconRarityLevel";

export type IconRendererProps = {
  iconName: string | null | undefined;
  className?: string;
  xp?: number;
};

export function IconRenderer({
  iconName,
  className = "",
  xp,
}: IconRendererProps) {
  const { iconColorClass, bgColorClass } = useIconRarityLevel(xp);
  const Icon = GiIcons[iconName as keyof typeof GiIcons];

  if (!Icon) {
    console.warn(`Icon ${iconName} not found`);
    return null;
  }

  const combinedClassName = `${bgColorClass} ${className}`.trim();

  return (
    <div className={`${combinedClassName}`}>
      <Icon className={`${iconColorClass} h-full w-full`} />
    </div>
  );
}
