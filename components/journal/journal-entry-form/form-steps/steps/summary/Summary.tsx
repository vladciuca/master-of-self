import { useFormContext } from "react-hook-form";
import { JournalStepTemplate } from "@components/journal/journal-entry-form/form-steps/steps/journal-step/JournalStepTemplate";
import { XpProgressBar } from "@components/practices/XpProgressBar";
import { IconRenderer } from "@components/IconRenderer";
import { getDayDisciplineScores, getNightDisciplineScores } from "@lib/score";
import { isEvening } from "@lib/time";
import { JOURNAL_COLORS } from "@lib/colors";
import type { UserPractices } from "@models/types";
import { useUserProfile } from "@context/UserProfileContext";
import { stepIconMap } from "@components/ui/constants";
import { JournalEntryHabits } from "@/components/journal/journal-entry-card/JournalEntryHabits";
import { calculateHabitsXpFromEntry } from "@/lib/level";
import { usePracticeData } from "@hooks/practices/usePracticeData";

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
  const { practiceData, isLoading } = usePracticeData(
    dayEntry,
    nightEntry
  );

  // Get discipline scores for day and night
  const dayDisciplines = getDayDisciplineScores(dayEntry);
  const nightDisciplines = getNightDisciplineScores(nightEntry);

  // Filter out discipline from day and night disciplines before rendering
  const filteredDayDisciplineScores = Object.entries(
    dayDisciplines || {}
  ).filter(([key, value]) => key !== "discipline" && value > 0);

  const filteredNightDisciplineScores = Object.entries(
    nightDisciplines || {}
  ).filter(
    ([key, value]) =>
      key !== "discipline" &&
      key !== "_disciplineMultiplier" &&
      key !== "_highlightsScore" &&
      value > 0
  );

  // Calculate discipline score (multiply day and night values)
  const disciplineDayScore = dayDisciplines.discipline || 0;
  const disciplineNightScore = nightDisciplines._highlightsScore ?? 0;
  const disciplineMultiplier = nightDisciplines._disciplineMultiplier || 1;

  const disciplineScore =
    (disciplineDayScore + disciplineNightScore) * disciplineMultiplier;

  // Check if there are any discipline scores with values > 0
  const hasPositiveDayDisciplineScores = filteredDayDisciplineScores.length > 0;
  const hasPositiveNightDisciplineScores =
    filteredNightDisciplineScores.length > 0;

  // Helper function to check if a key is a practice ID (MongoDB ObjectId)
  const isPracticeId = (key: string): boolean => {
    // Check if it matches MongoDB ObjectId format (24 hex chars)
    const isObjectId = /^[a-f\d]{24}$/i.test(key);

    return isObjectId;
  };

  // // Helper function to get practice display name
  const getPracticeDisplayName = (key: string): string => {
    if (isPracticeId(key) && practiceData[key]) {
      return practiceData[key].name;
    }

    // Convert camelCase to separate words and capitalize each word
    return key
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
  };

  // Helper function to get practice icon
  const getPracticeIcon = (key: string): string => {
    if (
      isPracticeId(key) &&
      practiceData[key] &&
      practiceData[key].icon
    ) {
      return practiceData[key].icon;
    }
    //NOTE: Need to remove icons i think!
    return key === "discipline" ? stepIconMap.day : "";
  };

  // Consolidated section title and empty state message
  const sectionTitle = isEveningTime
    ? "Evening Practices"
    : "Morning Practices";
  const emptyStateMessage = isEveningTime
    ? "Complete evening journal pages to increase your discipline."
    : "Complete morning journal pages to increase your discipline.";
  const iconColor = isEveningTime
    ? `text-${JOURNAL_COLORS.night}`
    : `text-${JOURNAL_COLORS.day}`;

  // Function to render practice bars
  const renderPracticeBars = (
    practiceScores: [string, number][],
    sectionKey: string
  ) => {
    return practiceScores.map(([key, value]) => {
      const projectedXp = value;
      const xp = (userProfile.practices as Record<string, number>)[key] ?? 0;
      const displayName = getPracticeDisplayName(key);
      const icon = getPracticeIcon(key);
      const color =
        isPracticeId(key) && practiceData[key]?.color
          ? practiceData[key].color
          : undefined;
      const textColor = isPracticeId(key)
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
          <XpProgressBar
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

  // Show loading state while fetching practice data
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
        <h2 className={`w-full flex justify-center text-primary`}>
          <IconRenderer
            iconName={isEveningTime ? stepIconMap.night : stepIconMap.day}
            size={35}
            className={iconColor}
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
            {disciplineScore > 0 && (
              <div className="flex items-center justify-center">
                {/* <IconRenderer
                  // iconName={getDisciplineIcon("discipline")}
                  iconName={"GiBullseye"}
                  size={35}
                  className="text-primary mr-4"
                /> */}

                <XpProgressBar
                  xp={userProfile.disciplines.discipline ?? 0}
                  projectedXp={disciplineScore}
                  name="Discipline"
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
                  {renderPracticeBars(
                    isEveningTime
                      ? filteredNightDisciplineScores
                      : filteredDayDisciplineScores,
                    isEveningTime ? "night" : "day"
                  )}
                </>
              ) : (
                <>
                  {(disciplineScore <= 0 || disciplineNightScore <= 1) && (
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
