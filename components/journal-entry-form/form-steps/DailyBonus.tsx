import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SkeletonList from "../../skeletons/SkeletonList";
import { FaBoltLightning } from "react-icons/fa6";

interface Session {
  user?: {
    id?: string | null;
  };
}

const DailyBonus = ({ bonusWillpower }: { bonusWillpower: number }) => {
  const { data: session } = useSession() as { data: Session | null };
  const [dailyHighlights, setDailyHighlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <>
      <div className="text-center sticky top-0 bg-background z-10">
        <span className="text-muted-foreground">
          {"Earned from yesterday's highlights!"}
        </span>
        <div className="text-4xl my-3 flex items-center justify-center">
          <FaBoltLightning />
          <span className="text-green-500 font-semibold">
            +{bonusWillpower}
          </span>
        </div>
      </div>
      <div className="mt-12">
        {isLoading && <SkeletonList />}
        {!isLoading && dailyHighlights.length > 0 && (
          <ol className="pl-6 mx-3 mt-2 list-decimal text-base">
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
