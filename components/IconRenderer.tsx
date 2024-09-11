import React from "react";
import * as GiIcons from "react-icons/gi";

type IconRendererProps = {
  iconName: string | null | undefined;
  className?: string;
};

export function IconRenderer({ iconName, className }: IconRendererProps) {
  const Icon = GiIcons[iconName as keyof typeof GiIcons];

  if (!Icon) {
    console.warn(`Icon ${iconName} not found`);
    return null;
  }

  return <Icon className={className} />;
}
