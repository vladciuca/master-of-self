import { DisciplineProgressBar } from "@components/disciplines/DisciplineProgressBar";
import { useUserProfile } from "@context/UserProfileContext";
import { useDisciplinesData } from "@hooks/disciplines/useDisciplineData";
import { UserDisciplines } from "@models/types";
import { IconRenderer } from "@components/IconRenderer";
import { Skeleton } from "@components/ui/skeleton";

export function ProfileDisciplines() {
  const { userProfile, userProfileLoading, userProfileError } =
    useUserProfile();

  // Make sure disciplines exist before proceeding
  const disciplines = userProfile?.disciplines || {};

  // Extract valid MongoDB ObjectId strings (24 hex chars)
  const ids = Object.keys(disciplines).filter((key) =>
    /^[a-f\d]{24}$/i.test(key)
  );

  const { disciplineData, isLoading, error } = useDisciplinesData(
    undefined,
    undefined,
    ids
  );

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
    // Default icons based on key name
    return "";
  };

  const getColor = (key: string): string | undefined => {
    if (isDisciplineId(key) && disciplineData && disciplineData[key]?.color) {
      return disciplineData[key].color;
    }
    return undefined;
  };

  const getTextColor = (key: string): string =>
    isDisciplineId(key) ? "text-primary" : "text-muted-foreground";

  // Safe check for disciplines data
  if (!disciplineData && ids.length > 0) {
    return <div className="py-4">No discipline data available</div>;
  }

  const renderDisciplineBars = (disciplines: UserDisciplines) => {
    return Object.entries(disciplines)
      .filter(([key]) => key !== "motivationMultiplier") // Filter out unwanted keys
      .map(([key, value]) => {
        return (
          <div key={`discipline-${key}`} className="flex items-center mb-3">
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

  if (userProfileLoading || isLoading) {
    return (
      <div className="space-y-3 mx-2">
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
  }

  if (userProfileError || error)
    return (
      <div className="py-4 text-red-500">
        Error loading: {userProfileError || error}
      </div>
    );

  return (
    <div className="discipline-progress-container">
      {Object.keys(disciplines).length === 0 ? (
        <div className="py-4 text-muted-foreground">No disciplines found</div>
      ) : (
        renderDisciplineBars(disciplines)
      )}
    </div>
  );
}
