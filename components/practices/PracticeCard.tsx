import React from "react";
import {
  AccordionItem,
  AccordionContent,
} from "@components/ui/accordion";
import { IndicatorAccordionTrigger } from "@components/ui/indicator-accordion-trigger";
import { IconRenderer } from "@components/IconRenderer";
import { PracticeCardContent } from "@components/practices/PracticeCardContent";
import { isHexColor, cn } from "@lib/utils";
import type { JournalCustomStepConfig } from "@models/types";
import type { Practice } from "@models/mongodb";

type Step = JournalCustomStepConfig | Practice;

type PracticeCardProps = {
  step?: Step;
  value?: string;
  icon?: string;
  title?: string;
  discipline?: string;
  color?: string;
  type?: "dayEntry" | "nightEntry";
  action?: React.ReactNode;
  disciplineIcon?: React.ReactNode;
  footer?: React.ReactNode;
  expandedContent?: React.ReactNode;
  showDescription?: boolean;
  iconClassName?: string;
  iconSize?: number;
  className?: string;
  triggerClassName?: string;
  disableAccordionToggle?: boolean;
};

export function PracticeCard({
  step,
  value,
  icon,
  title,
  discipline,
  color,
  action,
  disciplineIcon,
  footer,
  expandedContent,
  showDescription = true,
  iconClassName,
  iconSize = 50,
  className,
  triggerClassName,
  disableAccordionToggle = false,
}: PracticeCardProps) {
  const resolvedValue = value ?? (step ? String(step._id) : "");
  const resolvedIcon = icon ?? step?.icon;
  const resolvedTitle = title ?? step?.title;
  const resolvedDiscipline = discipline ?? step?.discipline;
  const resolvedColor = color ?? step?.color;

  const iconFrameClass = cn(
    "border border-primary p-2 rounded-md bg-background",
    iconClassName
  );
  const iconColorClass = isHexColor(resolvedColor)
    ? ""
    : resolvedColor
      ? `text-${resolvedColor}`
      : "";
  const iconStyle = isHexColor(resolvedColor)
    ? { color: resolvedColor }
    : undefined;

  return (
    <AccordionItem
      value={resolvedValue}
      className={`p-0 border-none mb-0 ${className ?? ""}`}
    >
      <IndicatorAccordionTrigger
        className={`py-0 ${triggerClassName ?? ""}`}
        disabled={disableAccordionToggle}
        indicatorPosition="start"
      >
        <div className="grid grid-cols-[auto_1fr_auto] grid-rows-[1.25rem_auto] gap-x-3 w-full items-start">
          {resolvedIcon && (
            <div className="col-start-1 row-start-1 row-span-2 self-center justify-self-center w-[66px] h-[66px] overflow-visible">
              <IconRenderer
                iconName={resolvedIcon}
                className={`${iconFrameClass} ${iconColorClass}`}
                size={iconSize}
                style={iconStyle}
              />
            </div>
          )}

          {(resolvedDiscipline || resolvedTitle) && (
            <div className="col-start-2 row-start-1 self-start text-start text-sm text-muted-foreground capitalize flex items-center gap-2">
              {disciplineIcon}
              <span className={resolvedDiscipline ? "" : "invisible"}>
                {resolvedDiscipline || "placeholder"}
              </span>
            </div>
          )}
          {resolvedTitle && (
            <div className="col-start-2 row-start-2 self-center text-[1rem] text-start leading-tight">
              {resolvedTitle}
            </div>
          )}

          {action && (
            <div
              className="col-start-3 row-start-1 row-span-2 self-center justify-self-center w-11 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {action}
            </div>
          )}
        </div>
      </IndicatorAccordionTrigger>

      <AccordionContent>
        {showDescription && step?.description && (
          <PracticeCardContent description={step.description} />
        )}
        {expandedContent}
        {footer}
      </AccordionContent>
    </AccordionItem>
  );
}
