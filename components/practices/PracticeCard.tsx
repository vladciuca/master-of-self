import React from "react";
import {
  AccordionItem,
  AccordionContent,
} from "@components/ui/accordion";
import { IndicatorAccordionTrigger } from "@components/ui/indicator-accordion-trigger";
import { IconRenderer } from "@components/IconRenderer";
import { PracticeCardContent } from "@components/practices/PracticeCardContent";
import { cn } from "@lib/utils";
import { getRuntimeColorProps } from "@lib/utils";
import { PiCaretUpFill, PiCaretDownFill } from "react-icons/pi";
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
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  disableMoveUp?: boolean;
  disableMoveDown?: boolean;
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
  onMoveUp,
  onMoveDown,
  disableMoveUp = false,
  disableMoveDown = false,
}: PracticeCardProps) {
  const resolvedValue = value ?? (step ? String(step._id) : "");
  const resolvedIcon = icon ?? step?.icon;
  const resolvedTitle = title ?? step?.title;
  const resolvedDiscipline = discipline ?? step?.discipline;
  const resolvedColor = color ?? step?.color;

  const iconFrameClass = cn(
    "border border-primary p-2 rounded-full bg-background",
    iconClassName
  );
  const iconColorProps = getRuntimeColorProps(resolvedColor, "text");
  const iconColorClass = iconColorProps.className ?? "";
  const iconStyle = iconColorProps.style;

  const isReorderMode = Boolean(onMoveUp || onMoveDown);

  const moveButtonClass =
    "text-muted-foreground hover:text-primary transition-colors disabled:opacity-30 disabled:hover:text-muted-foreground";

  const reorderAccessory = isReorderMode ? (
    <div className="flex flex-col items-center justify-center gap-6 mr-2 flex-shrink-0 pointer-events-auto">
      <button
        type="button"
        aria-label="Move practice up"
        className={moveButtonClass}
        disabled={disableMoveUp}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onMoveUp?.();
        }}
      >
        <PiCaretUpFill className="h-3 w-4" />
      </button>
      <button
        type="button"
        aria-label="Move practice down"
        className={moveButtonClass}
        disabled={disableMoveDown}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onMoveDown?.();
        }}
      >
        <PiCaretDownFill className="h-3 w-4" />
      </button>
    </div>
  ) : undefined;

  return (
    <AccordionItem
      value={resolvedValue}
      className={`p-0 border-none mb-0 ${className ?? ""}`}
    >
      <IndicatorAccordionTrigger
        className={`py-0 ${triggerClassName ?? ""}`}
        disabled={disableAccordionToggle}
        indicatorPosition="start"
        leadingAccessory={reorderAccessory}
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
