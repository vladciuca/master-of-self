import React from "react";
import {
  AccordionItem,
  AccordionContent,
} from "@components/ui/accordion";
import { IndicatorAccordionTrigger } from "@components/ui/indicator-accordion-trigger";
import { IconRenderer } from "@components/IconRenderer";
import { PracticeCardContent } from "@components/practices/discipline-card/PracticeCardContent";
import { isHexColor } from "@lib/utils";
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
  footer?: React.ReactNode;
  expandedContent?: React.ReactNode;
  showDescription?: boolean;
  hideIconBorder?: boolean;
  iconSize?: number;
  className?: string;
};

export function PracticeCard({
  step,
  value,
  icon,
  title,
  discipline,
  color,
  action,
  footer,
  expandedContent,
  showDescription = true,
  hideIconBorder,
  iconSize = 50,
  className,
}: PracticeCardProps) {
  const resolvedValue = value ?? (step ? String(step._id) : "");
  const resolvedIcon = icon ?? step?.icon;
  const resolvedTitle = title ?? step?.title;
  const resolvedDiscipline = discipline ?? step?.discipline;
  const resolvedColor = color ?? step?.color;

  const iconFrameClass = hideIconBorder
    ? "p-2 rounded-md"
    : "border border-primary p-2 rounded-md";
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
      className={`p-0 mb-3 border-none ${className ?? ""}`}
    >
      <IndicatorAccordionTrigger className="py-0">
        <div className="flex flex-row w-full pl-2">
          {resolvedIcon && (
            <div className="flex-shrink-0 flex items-center justify-center mb-0 mr-2 w-[66px] h-[66px] overflow-visible">
              <IconRenderer
                iconName={resolvedIcon}
                className={`${iconFrameClass} ${iconColorClass}`}
                size={iconSize}
                style={iconStyle}
              />
            </div>
          )}

          <div className="px-2 flex flex-col items-start w-full min-w-0">
            {(resolvedDiscipline || resolvedTitle) && (
              <div className="h-full w-full capitalize text-sm flex items-start text-muted-foreground justify-between">
                <span className={resolvedDiscipline ? "" : "invisible"}>
                  {resolvedDiscipline || "placeholder"}
                </span>
              </div>
            )}
            {resolvedTitle && (
              <div className="h-full mt-1 text-[1rem] text-start flex items-baseline">
                <div>{resolvedTitle}</div>
              </div>
            )}
          </div>

          {action && (
            <div
              className="flex-shrink-0 flex items-center justify-center"
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
