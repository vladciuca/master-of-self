import React, { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { Label } from "@components/ui/label";
import { SkeletonList } from "@components/skeletons/SkeletonList";
import { FaBoltLightning } from "react-icons/fa6";
import { BsChevronCompactDown } from "react-icons/bs";
import { GiEmbrassedEnergy } from "react-icons/gi";
import { Session } from "@/app/types/types";

type DailyBonusProps = {
  bonusWillpower: number;
};

export function DailyBonus({ bonusWillpower }: DailyBonusProps) {
  const { data: session } = useSession() as { data: Session | null };
  const [dailyHighlights, setDailyHighlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const highlightsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchYesterdayEntry = async () => {
      if (session?.user?.id) {
        try {
          setIsLoading(true);
          const yesterdayEntryResponse = await fetch(
            `/api/users/${session.user.id}/journal-entries/yesterday`
          );

          if (!yesterdayEntryResponse.ok) {
            throw new Error("Failed to fetch yesterday's entry");
          }

          const yesterdayEntry = await yesterdayEntryResponse.json();
          setDailyHighlights(yesterdayEntry?.nightEntry?.dailyHighlights || []);
        } catch (error) {
          console.error("Error fetching yesterday's highlights", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchYesterdayEntry();
  }, []);

  const scrollToHighlights = () => {
    highlightsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <FormStepTemplate title="Bonus Willpower">
      <div className="h-full overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-between min-h-full">
            <div className="flex flex-col items-center">
              <GiEmbrassedEnergy size={200} />
              <div className="text-4xl my-4 flex items-center">
                <span className="text-green-500 font-semibold mr-2">
                  +{bonusWillpower}
                </span>
                <FaBoltLightning />
              </div>
              <p className="font-semibold text-muted-foreground">
                Empowered from yesterday's highlights!
              </p>
            </div>

            <div className="h-full flex items-center">
              <BsChevronCompactDown
                className="text-muted-foreground cursor-pointer"
                size={48}
                onClick={scrollToHighlights}
              />
            </div>
          </div>

          <div ref={highlightsRef} className="flex-1 min-h-full px-4">
            <Label className="w-full text-center">
              <div className="leading-relaxed text-muted-foreground mx-4 mb-6">
                {"Yesterday's highlights!"}
              </div>
            </Label>
            {isLoading ? (
              <SkeletonList />
            ) : (
              <ol className="list-decimal pl-5">
                {dailyHighlights.map((highlight, index) => (
                  <li key={index} className="mb-2">
                    {highlight}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </FormStepTemplate>
  );
}
