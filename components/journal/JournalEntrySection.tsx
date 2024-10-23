import React, { ReactElement } from "react";
import { FaCheck, FaCircle } from "react-icons/fa";
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
  const dayPeriodTextColor = dayPeriod === "day" ? "yellow-500" : "purple-500";

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
                {checked ? (
                  <div
                    className={`rounded-full w-2 h-2 mt-[6px] bg-[linear-gradient(to_right,_#eab308_50%,_#a855f7_50%)]`}
                  />
                ) : (
                  <div
                    className={`rounded-full w-2 h-2 mt-[6px] bg-${dayPeriodTextColor}`}
                  />
                )}

                {/* {checked && (
                  <FaCheck className="absolute z-10 top-[4px] left-[1.5px] text-green-500 text-xs" />
                )} */}
              </span>
              <span className="ml-2">{item}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
