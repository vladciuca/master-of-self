"use client";

import { CardTitle, CardDescription } from "@components/ui/card";
import { FaBoltLightning } from "react-icons/fa6";
import { formatNumberSuffixes } from "@lib/utils";
import { useCurrentWillpower } from "@hooks/useCurrentWillpower";

export function TotalWillpower() {
  const { currentWillpower, currentWillpowerLoading } = useCurrentWillpower();

  return (
    <div>
      <CardTitle className="flex justify-between items-baseline">
        <span>Total Willpower</span>
        <span className="flex items-center text-4xl font-bold">
          {currentWillpowerLoading ? (
            "??"
          ) : (
            <span>{formatNumberSuffixes(currentWillpower)}</span>
          )}
          <FaBoltLightning className="ml-1 text-3xl" />
        </span>
      </CardTitle>
      <CardDescription className="w-3/4 md-w-4/6">
        The amount of Willpower generated through journaling.
      </CardDescription>
    </div>
  );
}
