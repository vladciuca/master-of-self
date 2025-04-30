import { DisciplineProgressBar } from "@components/disciplines/DisciplineProgressBar";
import { useUserProfile } from "@context/UserProfileContext";
import { useDisciplinesData } from "@hooks/disciplines/useDisciplineData";
import { UserDisciplines } from "@models/types";

export function ProfileDisciplines() {
  const { userProfile } = useUserProfile();
  const disciplines = userProfile.disciplines;

  const ids = Object.keys(userProfile.disciplines).filter((key) =>
    /^[a-f\d]{24}$/i.test(key)
  );

  const { disciplineData } = useDisciplinesData(undefined, undefined, ids);

  const isDisciplineId = (key: string): boolean => /^[a-f\d]{24}$/i.test(key);

  const getDisplayName = (key: string): string =>
    isDisciplineId(key) && disciplineData[key]
      ? disciplineData[key].name
      : key.charAt(0).toUpperCase() + key.slice(1);

  const getColor = (key: string): string | undefined =>
    isDisciplineId(key) && disciplineData[key]?.color
      ? disciplineData[key].color
      : undefined;

  const getTextColor = (key: string): string =>
    isDisciplineId(key) ? "text-primary" : "text-muted-foreground";

  const renderDisciplineBars = (disciplines: UserDisciplines) => {
    return Object.entries(disciplines).map(([key, value]) => {
      //NOTE why the fuck is this key in the DB? need to remove it!
      if (key === "motivationMultiplier") return null;

      return (
        <div key={`${key}`} className="flex items-center justify-center mb-2">
          <DisciplineProgressBar
            xp={value}
            projectedXp={0}
            name={getDisplayName(key)}
            color={getColor(key)}
            height={6}
            textColor={getTextColor(key)}
            isProfileDiscipline
          />
        </div>
      );
    });
  };

  return <div>{renderDisciplineBars(disciplines)}</div>;
}
