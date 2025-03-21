"use client";

import { CardTitle, CardDescription } from "@components/ui/card";
import { FaBoltLightning } from "react-icons/fa6";
import { formatNumberSuffixes } from "@lib/utils";
import { useTotalWillpower } from "@hooks/useTotalWillpower";

export function TotalWillpower() {
  const { totalWillpower, totalWillpowerLoading, totalWillpowerError } =
    useTotalWillpower();

  return (
    <div>
      <CardTitle className="flex justify-between items-baseline">
        <span>Total Willpower</span>

        <span className="flex items-center text-3xl font-bold">
          {totalWillpowerLoading ? (
            "??"
          ) : totalWillpowerError ? (
            <span className="text-destructive text-lg">
              {totalWillpowerError}
            </span>
          ) : (
            <span>{formatNumberSuffixes(totalWillpower)}</span>
          )}
          <FaBoltLightning className="ml-1 text-2xl" />
        </span>
      </CardTitle>
      <CardDescription className="w-3/4 md-w-4/6">
        The amount of Willpower generated through journaling.
      </CardDescription>
    </div>
  );
}
