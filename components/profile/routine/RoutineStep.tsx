import { Switch } from "@components/ui/switch";
import { useUserSettings } from "@context/UserSettingsContext";
import { RoutineStepProps } from "@models/types";

export function RoutineStep({
  icon,
  title,
  description,
  stepKey,
}: RoutineStepProps) {
  const { userSettings, userSettingsLoading, handleRoutineChange } =
    useUserSettings();

  return (
    <div className="my-4 flex justify-between items-center">
      <span className="w-3/12 flex items-center justify-center mr-4">
        {icon}
      </span>

      <div className="flex flex-grow">
        <div>
          <h1>{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <span className="w-3/12 flex items-center justify-center">
        <Switch
          checked={userSettings.steps[stepKey]}
          onCheckedChange={() => handleRoutineChange(stepKey)}
          disabled={userSettingsLoading}
        />
      </span>
    </div>
  );
}
