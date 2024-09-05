import React, { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import SkeletonList from "@components/skeletons/SkeletonList";
import { FaBoltLightning } from "react-icons/fa6";
import { BsChevronCompactDown } from "react-icons/bs";
import { GiEmbrassedEnergy } from "react-icons/gi";
import { Session } from "@/app/types/types";

const DailyBonus = ({ bonusWillpower }: { bonusWillpower: number }) => {
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
  }, [session]);

  const scrollToHighlights = () => {
    highlightsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="h-full overflow-hidden">
      <div className="min-h-[800px]">
        <div className="w-full flex justify-center">
          <GiEmbrassedEnergy size={"12rem"} />
        </div>
        <div className="text-center">
          <div className="text-4xl my-4 flex items-center justify-center">
            <span className="text-green-500 font-semibold mr-2">
              +{bonusWillpower}
            </span>
            <FaBoltLightning />
          </div>
          <span className="text-muted-foreground">
            {"Empowered from yesterday's highlights!"}
          </span>
        </div>
        <div className="my-12 w-full flex justify-center">
          <BsChevronCompactDown
            className="my-6 text-muted-foreground cursor-pointer"
            size={"3rem"}
            onClick={scrollToHighlights}
          />
        </div>
      </div>

      <div className="mx-2" ref={highlightsRef}>
        <div className="text-muted-foreground w-full text-center mb-6">
          {"Yesterday's highlights!"}
        </div>
        {isLoading && <SkeletonList />}
        {!isLoading && dailyHighlights.length > 0 && (
          <ol className="pl-6 list-disc text-base h-[400px] overflow-scroll">
            {dailyHighlights.map((highlightItem, index) => (
              <li key={index}>{highlightItem}</li>
            ))}
          </ol>
        )}
      </div>
      <div className="h-[500px]" />
    </div>
  );
};

export default DailyBonus;
