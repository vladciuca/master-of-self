import type React from "react";
import { Button } from "@/components/ui/button";

interface NavButtonProps {
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
}

export function NavButton({
  children,
  className = "",
  isActive = false,
}: NavButtonProps) {
  return (
    <Button
      variant="ghost"
      className={`h-[48px] w-[84px] py-1 rounded-full flex flex-col items-center justify-center focus:outline-none focus:ring-0 active:bg-accent ${
        isActive ? "bg-accent" : ""
      } ${className}`}
    >
      {children}
    </Button>
  );
}
