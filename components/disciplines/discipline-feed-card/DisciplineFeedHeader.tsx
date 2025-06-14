import { DisciplineCreator } from "@components/disciplines/discipline-card/DisciplineCreator";
import { IconRenderer } from "@components/IconRenderer";
import { stepIconMap } from "@components/ui/constants";
// import { JOURNAL_COLORS } from "@lib/colors";

type DisciplineFeedHeaderProps = {
  icon?: string;
  color?: string;
  discipline: string;
  title: string;
  type?: string;
  creatorId?: string;
};

export function DisciplineFeedHeader({
  icon,
  color,
  discipline,
  title,
  type,
  creatorId,
}: DisciplineFeedHeaderProps) {
  return (
    <div className="flex flex-row w-full pl-2">
      {/* Icon section */}
      {icon && (
        <div className="w-3/12 flex items-center justify-center mb-0">
          <IconRenderer iconName={icon} className={`text-${color}`} size={40} />
        </div>
      )}

      {/* Content section */}
      <div className="flex flex-col items-start w-full">
        <span className="px-2 capitalize">{discipline}</span>
        {creatorId && <DisciplineCreator creatorId={String(creatorId)} />}
      </div>

      {/* Toggle switch */}
      {type && (
        <div className="w-3/12 flex items-center justify-center mt-0">
          {type === "dayEntry" ? (
            <IconRenderer
              iconName={stepIconMap.day}
              // className={`text-${JOURNAL_COLORS.day}`}
              className="text-muted"
              // size={35}
              size={25}
            />
          ) : (
            <IconRenderer
              iconName={stepIconMap.night}
              // className={`text-${JOURNAL_COLORS.night}`}
              className="text-muted"
              // size={35}
              size={25}
            />
          )}
        </div>
      )}
    </div>
  );
}
