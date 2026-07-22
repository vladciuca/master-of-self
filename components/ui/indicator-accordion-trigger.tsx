import { AccordionTrigger } from "@/components/ui/accordion";
import { PiCaretDownFill } from "react-icons/pi";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type CustomAccordionTriggerProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  hideIndicator?: boolean;
  indicatorPosition?: "bottom" | "start";
};

export function IndicatorAccordionTrigger({
  children,
  className,
  disabled = false,
  hideIndicator = false,
  indicatorPosition = "bottom",
}: CustomAccordionTriggerProps) {
  if (indicatorPosition === "start") {
    return (
      <AccordionTrigger
        disabled={disabled}
        className={cn(
          "py-1 group",
          disabled ? "pointer-events-none" : "",
          className
        )}
      >
        <div className="flex items-center w-full">
          {!hideIndicator && (
            <PiCaretDownFill
              className={cn(
                "h-3 w-4 mr-2 flex-shrink-0 transition-transform duration-200 ease-in-out group-data-[state=open]:rotate-180",
                disabled ? "text-muted-foreground/40" : ""
              )}
            />
          )}
          <div className="flex-1">{children}</div>
        </div>
      </AccordionTrigger>
    );
  }

  return (
    <AccordionTrigger
      disabled={disabled}
      className={cn(
        "py-1 [&[data-state=open]>div>div:last-child>svg]:rotate-180",
        disabled ? "pointer-events-none" : "",
        className
      )}
    >
      <div className="flex flex-col w-full">
        {children}
        {!hideIndicator && (
          <div className="flex justify-center">
            <PiCaretDownFill
              className={cn(
                "h-4 w-6 transition-transform duration-200 ease-in-out",
                disabled ? "text-muted-foreground/40" : ""
              )}
            />
          </div>
        )}
      </div>
    </AccordionTrigger>
  );
}
