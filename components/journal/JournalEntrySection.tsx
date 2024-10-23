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
                    className={`rounded-full w-3 h-3 mt-[4px] bg-[linear-gradient(to_right,_#F59E0B_50%,_#8B5CF6_50%)] opacity-75`}
                  />
                ) : (
                  <div
                    className={`rounded-full w-3 h-3 mt-[4px] bg-${dayPeriodTextColor} opacity-75`}
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
