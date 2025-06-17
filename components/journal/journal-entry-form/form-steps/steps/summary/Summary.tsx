import { useFormContext } from "react-hook-form";
import { JournalStepTemplate } from "@components/journal/journal-entry-form/form-steps/steps/journal-step/JournalStepTemplate";
import { DisciplineProgressBar } from "@components/disciplines/DisciplineProgressBar";
import { IconRenderer } from "@components/IconRenderer";
import { getDayDisciplineScores, getNightDisciplineScores } from "@lib/score";
import { isEvening } from "@lib/time";
// import { JOURNAL_COLORS } from "@lib/colors";
import type { UserDisciplines } from "@models/types";
import { useUserProfile } from "@context/UserProfileContext";
import { stepIconMap } from "@components/ui/constants";
import { JournalEntryHabits } from "@/components/journal/journal-entry-card/JournalEntryHabits";
import { calculateHabitsXpFromEntry } from "@/lib/level";
import { useDisciplinesData } from "@hooks/disciplines/useDisciplineData";

export const Summary = () => {
  const { watch } = useFormContext();
  const { userProfile } = useUserProfile();

  const userEveningTime = userProfile?.journalStartTime.evening;
  const isEveningTime = isEvening(userEveningTime);

  const dayEntry = watch("dayEntry");
  const nightEntry = watch("nightEntry");

  const habits = watch("habits");
  const dailyWillpower = watch("dailyWillpower");
  const bonusWillpower = watch("bonusWillpower");
  const totalWillpower = dailyWillpower + bonusWillpower;

  const habitsXpFromActions = habits
    ? calculateHabitsXpFromEntry({
        entryHabits: habits,
        entryWillpower: totalWillpower,
      })
    : {};

  // Use the custom hook to fetch discipline data
  const { disciplineData, isLoading } = useDisciplinesData(
    dayEntry,
    nightEntry
  );

  // Get discipline scores for day and night
  const dayDisciplines = getDayDisciplineScores(dayEntry);
  const nightDisciplines = getNightDisciplineScores(nightEntry);

  // Filter out motivation from day and night disciplines before rendering
  const filteredDayDisciplineScores = Object.entries(
    dayDisciplines || {}
  ).filter(([key, value]) => key !== "motivation" && value > 0);

  const filteredNightDisciplineScores = Object.entries(
    nightDisciplines || {}
  ).filter(
    ([key, value]) =>
      key !== "motivation" &&
      key !== "_motivationMultiplier" &&
      key !== "_highlightsScore" &&
      value > 0
  );

  // Calculate motivation score (multiply day and night values)
  const motivationDayScore = dayDisciplines.motivation || 0;
  const motivationNightScore = nightDisciplines._highlightsScore ?? 0;
  const motivationMultiplier = nightDisciplines._motivationMultiplier || 1;

  const motivationScore =
    (motivationDayScore + motivationNightScore) * motivationMultiplier;

  // Check if there are any discipline scores with values > 0
  const hasPositiveDayDisciplineScores = filteredDayDisciplineScores.length > 0;
  const hasPositiveNightDisciplineScores =
    filteredNightDisciplineScores.length > 0;

  // Helper function to check if a key is a discipline ID
  const isDisciplineId = (key: string): boolean => {
    // Check if it matches MongoDB ObjectId format (24 hex chars)
    const isObjectId = /^[a-f\d]{24}$/i.test(key);

    return isObjectId;
  };

  // Helper function to get discipline display name
  const getDisciplineDisplayName = (key: string): string => {
    if (isDisciplineId(key) && disciplineData[key]) {
      return disciplineData[key].name;
    }
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  // Helper function to get discipline icon
  const getDisciplineIcon = (key: string): string => {
    if (
      isDisciplineId(key) &&
      disciplineData[key] &&
      disciplineData[key].icon
    ) {
      return disciplineData[key].icon;
    }
    //NOTE: Need to remove icons i think!
    return key === "motivation" ? stepIconMap.day : "";
  };

  // Consolidated section title and empty state message
  const sectionTitle = isEveningTime
    ? "Evening Disciplines"
    : "Morning Disciplines";
  const emptyStateMessage = isEveningTime
    ? "Complete evening journal pages to increase your discipline."
    : "Complete morning journal pages to increase your discipline.";

  // Function to render discipline bars
  const renderDisciplineBars = (
    disciplineScores: [string, number][],
    sectionKey: string
  ) => {
    return disciplineScores.map(([key, value]) => {
      const disciplineKey = key as keyof UserDisciplines;
      const projectedXp = value;
      const xp = userProfile.disciplines[disciplineKey] ?? 0;
      const displayName = getDisciplineDisplayName(key);
      const icon = getDisciplineIcon(key);
      const color =
        isDisciplineId(key) && disciplineData[key]?.color
          ? disciplineData[key].color
          : undefined;
      const textColor = isDisciplineId(key)
        ? "text-primary"
        : "text-muted-foreground";

      return (
        <div
          key={`${sectionKey}-${key}`}
          className="flex items-center justify-center mb-4"
        >
          {/* {icon && (
            <IconRenderer
              iconName={icon}
              size={35}
              className={`text-${color} mr-4`}
            />
          )} */}
          <DisciplineProgressBar
            xp={xp}
            projectedXp={projectedXp}
            name={displayName}
            color={color}
            height={8}
            textColor={textColor}
          />
        </div>
      );
    });
  };

  // Show loading state while fetching discipline data
  if (isLoading) {
    return (
      <JournalStepTemplate
        // title={`${sectionTitle}`}
        title="Daily Summary"
      >
        <div className="flex flex-col justify-center pr-2">
          <div className="text-center">
            <h2 className="text-muted w-full flex justify-center text-5xl font-semibold tracking-tight mb-8">
              <div className="animate-pulse bg-muted h-12 w-12 rounded-full"></div>
            </h2>
            <div className="animate-pulse space-y-8 mt-4 sm:mt-12 px-6">
              <div className="h-8 bg-muted rounded-full w-full" />
              <div className="h-8 bg-muted rounded-full w-full" />
              <div className="h-8 bg-muted rounded-full w-full" />
            </div>
          </div>
        </div>
      </JournalStepTemplate>
    );
  }

  return (
    <JournalStepTemplate
      // title={`${sectionTitle}`}
      title="Daily Summary"
      scoreSection={
        <h2 className="text-muted w-full flex justify-center">
          <IconRenderer
            iconName={isEveningTime ? stepIconMap.night : stepIconMap.day}
            size={40}
          />
        </h2>
      }
    >
      <div className="flex-grow flex flex-wrap items-start mt-2 sm:mt-4 justify-center px-2">
        <JournalEntryHabits
          habitsXp={habitsXpFromActions}
          habits={habits}
          size={35}
        />
      </div>
      <div className="flex flex-col justify-center pr-2 mt-4 sm:mt-8">
        <div className="text-center">
          <div className="flex flex-col w-full">
            {motivationScore > 0 && (
              <div className="flex items-center justify-center">
                {/* <IconRenderer
                  // iconName={getDisciplineIcon("motivation")}
                  iconName={"GiBullseye"}
                  size={35}
                  className="text-primary mr-4"
                /> */}

                <DisciplineProgressBar
                  xp={userProfile.disciplines.motivation ?? 0}
                  projectedXp={motivationScore}
                  name="motivation"
                  height={8}
                  textColor="text-muted-foreground"
                />
              </div>
            )}

            <div className="mt-4">
              {(
                isEveningTime
                  ? hasPositiveNightDisciplineScores
                  : hasPositiveDayDisciplineScores
              ) ? (
                <>
                  {renderDisciplineBars(
                    isEveningTime
                      ? filteredNightDisciplineScores
                      : filteredDayDisciplineScores,
                    isEveningTime ? "night" : "day"
                  )}
                </>
              ) : (
                <>
                  {(motivationScore <= 0 || motivationNightScore <= 1) && (
                    <div className="flex items-center justify-center py-4 px-2 sm:px-4">
                      <span className="text-md text-muted-foreground">
                        {emptyStateMessage}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </JournalStepTemplate>
  );
};
