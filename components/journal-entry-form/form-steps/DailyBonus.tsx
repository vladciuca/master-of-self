import React, { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import SkeletonList from "../../skeletons/SkeletonList";
import { FaBoltLightning, FaChevronDown } from "react-icons/fa6";
import { GiEmbrassedEnergy } from "react-icons/gi";

interface Session {
  user?: {
    id?: string | null;
  };
}

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
    highlightsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="my-6 w-full flex justify-center">
        <GiEmbrassedEnergy size={"10rem"} />
      </div>
      <div className="text-center">
        <div className="text-4xl my-4 flex items-center justify-center">
          <span className="text-green-500 font-semibold mr-2">
            +{bonusWillpower}
          </span>
          <FaBoltLightning />
        </div>
        <span className="text-muted-foreground">
          {"Earned from yesterday's highlights!"}
        </span>
      </div>
      <div className="mt-6 w-full flex justify-center">
        <FaChevronDown
          className="my-6 text-muted-foreground cursor-pointer"
          size={"3rem"}
          onClick={scrollToHighlights}
        />
      </div>
      <div className="my-12 mx-12" ref={highlightsRef}>
        {isLoading && <SkeletonList />}
        {!isLoading && dailyHighlights.length > 0 && (
          <ol className="pl-6 mt-2 list-disc text-base">
            {dailyHighlights.map((highlightItem, index) => (
              <li key={index}>{highlightItem}</li>
            ))}
          </ol>
        )}
      </div>
    </>
  );
};

export default DailyBonus;
