import { AccordionTrigger } from "@/components/ui/accordion";
import { TbChevronCompactDown } from "react-icons/tb";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type CustomAccordionTriggerProps = {
  children: ReactNode;
  className?: string;
};

export function IndicatorAccordionTrigger({
  children,
  className,
}: CustomAccordionTriggerProps) {
  return (
    <AccordionTrigger
      className={cn(
        "py-1 [&[data-state=open]>div>div:last-child>svg]:rotate-180",
        className
      )}
    >
      <div className="flex flex-col w-full">
        {children}
        <div className="flex justify-center">
          <TbChevronCompactDown className="h-4 w-6 transition-transform duration-200 ease-in-out" />
        </div>
      </div>
    </AccordionTrigger>
  );
}
