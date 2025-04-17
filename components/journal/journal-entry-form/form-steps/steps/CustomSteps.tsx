import { JournalStep } from "@components/journal/journal-entry-form/form-steps/steps/journal-step/JournalStep";
import { stepIconMap } from "@components/ui/constants";
import type { JournalCustomStepConfig, JournalCustomStep } from "@models/types";
import type { Discipline } from "@models/mongodb";

export const customStepConfigs: JournalCustomStepConfig[] = [
  {
    _id: "positivity",
    icon: stepIconMap.positivity,
    discipline: "positivity",
    type: "dayEntry",
    title: "What am I feeling grateful for?",
    description:
      "Use details to describe what you're feeling grateful for and increase Positivity.",
  },
  {
    _id: "confidence",
    icon: stepIconMap.confidence,
    discipline: "confidence",
    type: "dayEntry",
    title: "Daily Affirmations",
    description:
      "Use statements using powerful words to imprint on your subconscious mind and build Confidence.",
  },
  {
    _id: "awareness",
    icon: stepIconMap.awareness,
    discipline: "awareness",
    type: "nightEntry",
    title: "What are today's highlights?",
    description:
      "Build momentum by capturing meaningful events and boost Awareness.",
  },
  {
    _id: "resilience",
    icon: stepIconMap.resilience,
    discipline: "resilience",
    type: "nightEntry",
    title: "Could today have been better?",
    description:
      "If you could go back, what would you change? Recognize what’s in your control, accept what isn’t.",
  },
];

export function generateCustomStepsFromConfig(
  disciplineSteps: JournalCustomStepConfig[] | Discipline[]
): JournalCustomStep[] {
  return disciplineSteps.map((config) => ({
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
