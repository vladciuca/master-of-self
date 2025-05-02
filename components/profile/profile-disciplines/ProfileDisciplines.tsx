import { useState, useEffect } from "react";
import { DisciplineProgressBar } from "@components/disciplines/DisciplineProgressBar";
import { IconRenderer } from "@components/IconRenderer";
import { Skeleton } from "@components/ui/skeleton";
import { useDisciplinesData } from "@hooks/disciplines/useDisciplineData";
import { UserDisciplines } from "@models/types";

type ProfileDisciplinesProps = {
  disciplines: UserDisciplines;
};

export function ProfileDisciplines({ disciplines }: ProfileDisciplinesProps) {
  // State to control the stable loading experience
  const [isStableLoading, setIsStableLoading] = useState(true);

  // Extract valid MongoDB ObjectId strings (24 hex chars)
  const ids = Object.keys(disciplines).filter((key) =>
    /^[a-f\d]{24}$/i.test(key)
  );

  // Fetch discipline data
  const {
    disciplineData,
    isLoading: isDisciplineLoading,
    error: disciplineError,
  } = useDisciplinesData(undefined, undefined, ids);

  // Use an effect to manage the stable loading state
  useEffect(() => {
    // Start with loading state
    setIsStableLoading(true);

    // Create a timer to prevent rapid loading state changes
    const loadingTimer = setTimeout(() => {
      // Only turn off loading when both data sources are ready
      if (!isDisciplineLoading) {
        setIsStableLoading(false);
      }
    }, 300); // Small delay to prevent flickering

    return () => clearTimeout(loadingTimer);
  }, [isDisciplineLoading]);

  const isDisciplineId = (key: string): boolean => /^[a-f\d]{24}$/i.test(key);

  const getDisplayName = (key: string): string => {
    if (isDisciplineId(key) && disciplineData && disciplineData[key]) {
      return disciplineData[key].name;
    }
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  // Helper function to get discipline icon
  const getDisciplineIcon = (key: string): string => {
    if (disciplineData && disciplineData[key]?.icon) {
      return disciplineData[key].icon;
    }
    // Default icon: *Motivation icon
    return "IoAccessibility";
  };

  const getColor = (key: string): string | undefined => {
    if (isDisciplineId(key) && disciplineData && disciplineData[key]?.color) {
      return disciplineData[key].color;
    }
    return undefined;
  };

  const getTextColor = (key: string): string =>
    isDisciplineId(key) ? "text-primary" : "text-muted-foreground";

  const renderDisciplineBars = (disciplines: UserDisciplines) => {
    return Object.entries(disciplines)
      .filter(([key]) => key !== "motivationMultiplier") // Filter out unwanted keys
      .map(([key, value]) => {
        return (
          <div key={`discipline-${key}`} className="flex items-center mb-5">
            <IconRenderer
              iconName={getDisciplineIcon(key)}
              size={30}
              className={`${getColor(key) ? `text-${getColor(key)}` : ""} ml-2`}
            />
            <DisciplineProgressBar
              xp={value}
              projectedXp={0}
              name={getDisplayName(key)}
              color={getColor(key)}
              height={8}
              textColor={getTextColor(key)}
            />
          </div>
        );
      });
  };

  // Render the loading skeletons
  const renderSkeletons = () => (
    <div className="space-y-5 mx-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={`skeleton-${i}`} className="flex items-center mb-3">
          <Skeleton className="h-8 w-8 rounded-full mr-2" />
          <div className="flex-1">
            <Skeleton className="h-8 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );

  // Show stable loading state
  if (isStableLoading) {
    return renderSkeletons();
  }

  // Handle errors
  if (disciplineError) {
    return (
      <div className="py-4 text-red-500">Error loading: {disciplineError}</div>
    );
  }

  // Only render discipline bars when disciplines exist AND disciplineData is loaded
  const hasDisciplines = Object.keys(disciplines).length > 0;
  const hasDisciplineData = Object.keys(disciplineData).length > 0;

  // Extra safety check to make sure we have data
  if (hasDisciplines && !hasDisciplineData) {
    return renderSkeletons();
  }

  return (
    <div>
      {!hasDisciplines ? (
        <div className="py-4 text-muted-foreground">No disciplines found</div>
      ) : (
        renderDisciplineBars(disciplines)
      )}
    </div>
  );
}
