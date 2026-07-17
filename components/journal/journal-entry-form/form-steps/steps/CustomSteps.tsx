import { JournalStep } from "@components/journal/journal-entry-form/form-steps/steps/journal-step/JournalStep";
import { DISCIPLINES } from "@lib/disciplines";
import type { JournalCustomStepConfig, JournalCustomStep } from "@models/types";
import type { Practice } from "@models/mongodb";

export const customStepConfigs: JournalCustomStepConfig[] = DISCIPLINES;

export function generateCustomStepsFromConfig(
  practiceSteps: JournalCustomStepConfig[] | Practice[]
): JournalCustomStep[] {
  return practiceSteps.map((config) => ({
    _id: config._id,
    icon: config.icon,
    type: config.type,
    discipline: config.discipline,
    color: config.color ?? "primary",
    component: (
      <JournalStep
        key={String(config._id)}
        _id={String(config._id)}
        type={config.type}
        discipline={config.discipline}
        title={config.title}
        description={config.description}
      />
    ),
  }));
}

export const customSteps = generateCustomStepsFromConfig(customStepConfigs);
