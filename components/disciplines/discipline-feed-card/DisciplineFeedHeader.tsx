import { IconRenderer } from "@components/IconRenderer";
import { stepIconMap } from "@components/ui/constants";
import { JOURNAL_COLORS } from "@lib/colors";

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
          <div>{discipline}</div>
          <div className="ml-3">
            {type === "dayEntry" ? (
              <IconRenderer
                iconName={stepIconMap.day}
                className={`text-${JOURNAL_COLORS.day}`}
                // className="text-muted-foreground"
                // size={35}
                size={22}
              />
            ) : (
              <IconRenderer
                iconName={stepIconMap.night}
                className={`text-${JOURNAL_COLORS.night}`}
                // className="text-muted-foreground"
                // size={35}
                size={22}
              />
            )}
          </div>
        </div>
        <div className="h-full mt-1 text-base sm:text-lg text-start flex items-baseline">
          <div>{title}</div>
        </div>
      </div>

      {/* Toggle switch */}
      {/* {type && (
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
      )} */}
    </div>
  );
}
