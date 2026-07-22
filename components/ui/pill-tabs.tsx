"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";

type PillTabsProps = {
  options: string[];
  activeOption: string;
  onSelect: (option: string) => void;
  className?: string;
};

export function PillTabs({
  options,
  activeOption,
  onSelect,
  className,
}: PillTabsProps) {
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const handleSelect = (option: string) => {
    onSelect(option);
    buttonRefs.current[option]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  return (
    <div
      className={`flex overflow-x-auto scrollbar-hide space-x-2 ${className ?? ""}`}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {options.map((option) => (
        <Button
          key={option}
          ref={(el) => {
            buttonRefs.current[option] = el;
          }}
          size="sm"
          variant={activeOption === option ? "secondary" : "outline"}
          onClick={() => handleSelect(option)}
          className="flex-shrink-0 text-xs rounded-full capitalize"
        >
          {option}
        </Button>
      ))}
    </div>
  );
}
