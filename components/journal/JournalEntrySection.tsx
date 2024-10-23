import React, { ReactElement } from "react";
import { FaSun, FaMoon, FaCheck, FaCircle } from "react-icons/fa";
import { GoDotFill, GoCheck } from "react-icons/go";

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
                {checked ? (
                  // <FaCircle
                  //   className={`${dayPeriodTextColor} opacity-75 mt-[3px]`}
                  // />
                  <div className="mt-[3px] h-3 w-3 bg-gradient-to-b from-yellow-500 to-purple-500 p-[3px] rounded-full">
                    <FaCircle className="text-transparent opacity-75 mt-[3px]" />
                  </div>
                ) : (
                  <GoDotFill
                    className={` ${dayPeriodTextColor} opacity-75 mt-[3px]`}
                  />
                )}
                {checked && (
                  <FaCheck className="absolute z-10 top-[3px] left-[1.5px] text-green-500 text-xs" />
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
