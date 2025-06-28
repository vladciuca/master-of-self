import { IconRenderer } from "@components/IconRenderer";
import { stepIconMap } from "@components/ui/constants";
import { JOURNAL_COLORS } from "@lib/colors";
import { CheckCircle } from "lucide-react";
import { useUserProfile } from "@context/UserProfileContext";

type DisciplineFeedHeaderProps = {
  icon?: string;
  color?: string;
  discipline: string;
  title: string;
  type?: string;
  stepId: string;
};

export function DisciplineFeedHeader({
  icon,
  color,
  discipline,
  title,
  type,
  stepId,
}: DisciplineFeedHeaderProps) {
  const { userProfile } = useUserProfile();

  // Check if this discipline is already added
  const isDisciplineAdded =
    userProfile.disciplines && stepId in userProfile.disciplines;

  return (
    <div className="flex flex-row w-full pl-2">
      {/* Icon section */}
      {icon && (
        <div className="flex items-center justify-center mb-0 mr-2">
          <IconRenderer
            iconName={icon}
            className={`text-${color} border border-${
              color ? color : "primary"
            } p-2 rounded-md`}
            size={50}
          />
        </div>
      )}

      {/* Content section */}
      <div className="px-2 flex flex-col items-start w-full">
        <div className="h-full w-full capitalize text-sm flex items-top text-muted-foreground justify-between">
          <div className="flex items-center gap-2">
            <div>
              {type === "dayEntry" ? (
                <IconRenderer
                  iconName={stepIconMap.day}
                  className={`text-${JOURNAL_COLORS.day}`}
                  size={22}
                />
              ) : (
                <IconRenderer
                  iconName={stepIconMap.night}
                  className={`text-${JOURNAL_COLORS.night}`}
                  size={22}
                />
              )}
            </div>
            {isDisciplineAdded && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            <span>{discipline}</span>
          </div>
        </div>
        <div className="h-full mt-1 text-base sm:text-lg text-start flex items-baseline">
          <div>{title}</div>
        </div>
      </div>
    </div>
  );
}
