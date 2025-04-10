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
      className={`h-[60px] w-[100px] py-1 rounded-full flex flex-col items-center justify-center hover:bg-transparent hover:text-inherit focus:outline-none focus:ring-0 active:bg-accent ${className}`}
    >
      {children}
    </Button>
  );
}
