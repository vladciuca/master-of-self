import { IconRenderer } from "@components/IconRenderer";
import { stepIconMap } from "@components/ui/constants";
// import { JOURNAL_COLORS } from "@lib/colors";

type DisciplineFeedHeaderProps = {
  icon?: string;
  color?: string;
  discipline: string;
  title: string;
  type?: string;
};

export function DisciplineFeedHeader({
  icon,
  color,
  discipline,
  title,
  type,
}: DisciplineFeedHeaderProps) {
  return (
    <div className="flex flex-row w-full pl-2">
      {/* Icon section */}
      {icon && (
        <div className="w-3/12 flex items-center justify-center mb-0">
          <IconRenderer iconName={icon} className={`text-${color}`} size={45} />
        </div>
      )}

      {/* Content section */}
      <div className="px-2 flex flex-col items-start w-full">
        <div className="w-full capitalize text-sm flex items-center text-muted-foreground justify-between">
          <span>{discipline}</span>
          {/* <span className="ml-3">
            {type === "dayEntry" ? (
              <IconRenderer
                iconName={stepIconMap.day}
                // className={`text-${JOURNAL_COLORS.day}`}
                className="text-muted"
                // size={35}
                size={22}
              />
            ) : (
              <IconRenderer
                iconName={stepIconMap.night}
                // className={`text-${JOURNAL_COLORS.night}`}
                className="text-muted"
                // size={35}
                size={22}
              />
            )}
          </span> */}
        </div>
        <span className="mt-1 text-md sm:text-lg text-start">{title}</span>
      </div>

      {/* Toggle switch */}
      {type && (
        <div className="w-2/12 flex items-start justify-center mt-0">
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
