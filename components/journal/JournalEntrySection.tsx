import React, { ReactElement } from "react";
import { FaCheck } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";

type EntrySectionProps = {
  icon: ReactElement;
  title: string;
  items?: string[];
  checked?: boolean;
  dayPeriod?: "night" | "day";
};

export function JournalEntrySection({
  icon,
  title,
  items,
  checked,
  dayPeriod,
}: EntrySectionProps) {
  const dayPeriodTextColor =
    dayPeriod === "day" ? "text-yellow-500" : "text-purple-500";

  return (
    <div className="mt-4">
      <div className="flex items-center mt-4">
        {React.cloneElement(icon, { className: "mr-2 text-muted-foreground" })}
        <div className="text-sm text-muted-foreground">{title}</div>
      </div>
      {items && items.length > 0 && (
        <ol className="mt-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-top">
              <span className="relative">
                <GoDotFill
                  className={` ${dayPeriodTextColor} opacity-75 mt-[3px]`}
                />
                {checked && (
                  <FaCheck className="absolute z-10 top-[5.5px] left-[3.5px] text-green-500 text-[0.5rem]" />
                )}
              </span>
              <span className="ml-2">{item}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
