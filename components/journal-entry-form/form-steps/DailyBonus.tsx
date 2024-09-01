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
    <div>
      <div className="text-center mt-6">
        Earned from yesterday's highlights!
        <div className="my-6 flex items-center justify-center">
          <FaBoltLightning size={"3.5rem"} />
          <span className="text-6xl text-green-500 font-semibold">
            {bonusWillpower}
          </span>
        </div>
      </div>

      {isLoading && <SkeletonList />}
      {!isLoading && dailyHighlights.length > 0 && (
        <div className="mt-6">
          <ol className="pl-6 mx-3 mt-2 list-decimal text-sm">
            {dailyHighlights.map((highlightItem, index) => (
              <li key={index}>{highlightItem}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default DailyBonus;
