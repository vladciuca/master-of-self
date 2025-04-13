import { JournalStep } from "@components/journal/journal-entry-form/form-steps/steps/journal-step/JournalStep";
import { stepIconMap } from "@components/ui/constants";
import { stringFromIcon } from "@lib/utils";
import type { JournalStepConfig, JournalEntryCustomStep } from "@models/types";

export const customStepConfigs: JournalStepConfig[] = [
  {
    icon: stringFromIcon(stepIconMap.positivity),
    discipline: "positivity",
    type: "dayEntry",
    title: "What am I feeling grateful for?",
    description:
      "Use details to describe what you're feeling grateful for and increase Positivity.",
  },
  {
    icon: stringFromIcon(stepIconMap.confidence),
    discipline: "confidence",
    type: "dayEntry",
    title: "Daily Affirmations",
    description:
      "Use statements using powerful words to imprint on your subconscious mind and build Confidence.",
  },
  {
    icon: stringFromIcon(stepIconMap.awareness),
    discipline: "awareness",
    type: "nightEntry",
    title: "What are today's highlights?",
    description:
      "Build momentum by capturing meaningful events and boost Awareness.",
  },
  {
    icon: stringFromIcon(stepIconMap.resilience),
    discipline: "resilience",
    type: "nightEntry",
    title: "Could today have been better?",
    description:
      "If you could go back, what would you change? Recognize what’s in your control, accept what isn’t.",
  },
];

export const customSteps: JournalEntryCustomStep[] = customStepConfigs.map(
  (config) => ({
    icon: config.icon,
    type: config.type,
    discipline: config.discipline,
    component: (
      <JournalStep
        //NOTE: might need to use an id here to avoid duplicate Discipline names
        key={config.discipline}
        type={config.type}
        discipline={config.discipline}
        title={config.title}
        description={config.description}
      />
    ),
  })
);
