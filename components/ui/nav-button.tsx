import type React from "react";
import { Button } from "@/components/ui/button";

interface NavButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function NavButton({ children, className = "" }: NavButtonProps) {
  return (
    <Button
      variant="ghost"
      className={`py-1 rounded-full w-full flex flex-col items-center justify-center h-full hover:bg-transparent hover:text-inherit focus:outline-none focus:ring-0 active:bg-accent ${className}`}
    >
      {children}
    </Button>
  );
}
