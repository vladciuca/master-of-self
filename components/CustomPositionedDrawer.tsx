import React, { useState, useRef, useEffect, ReactNode } from "react";
import { Drawer } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface CustomPositionedDrawerProps {
  children: ReactNode;
  trigger: ReactNode;
  position?: "left" | "right";
}

export const CustomPositionedDrawer: React.FC<CustomPositionedDrawerProps> = ({
  children,
  trigger,
  position = "left",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [drawerClasses, setDrawerClasses] = useState<string>("");

  useEffect(() => {
    if (containerRef.current && isOpen) {
      const rect = containerRef.current.getBoundingClientRect();
      const classes = cn(
        "fixed",
        position === "left" ? "left-0" : "right-0",
        `top-[${rect.top}px]`,
        `w-[${rect.width}px]`,
        `h-[${rect.height}px]`,
        "max-w-none"
      );
      setDrawerClasses(classes);
    }
  }, [isOpen, position]);

  return (
    <div ref={containerRef} className="relative">
      <div onClick={() => setIsOpen(true)}>{trigger}</div>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <div className={drawerClasses}>
          <div className="h-full overflow-y-auto">{children}</div>
        </div>
      </Drawer>
    </div>
  );
};
