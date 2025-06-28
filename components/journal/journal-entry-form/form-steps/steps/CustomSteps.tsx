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
      "Gratitude Practice - Reflect on things you're grateful for and why.",
  },
  {
    _id: "confidence",
    icon: stepIconMap.confidence,
    discipline: "confidence",
    type: "dayEntry",
    title: "Daily Affirmations",
    description:
      "Self-Affirmation - Write or say positive statements about yourself.",
  },
  {
    _id: "awareness",
    icon: stepIconMap.awareness,
    discipline: "awareness",
    type: "nightEntry",
    title: "What are today's highlights?",
    description:
      "Mindfulness Exercise - Practice meditation or deep focus exercises.",
  },
  {
    _id: "resilience",
    icon: stepIconMap.resilience,
    discipline: "resilience",
    type: "nightEntry",
    title: "How did I bounce back from a challenge today?",
    description:
      "Overcoming Obstacles - Reflect on a past challenge and how you grew from it.",
  },
  {
    _id: "empathy",
    icon: stepIconMap.empathy,
    discipline: "empathy",
    type: "nightEntry",
    title: "What kind act did I do or witness today?",
    description: "Kindness- Perform a small act of kindness and reflect on it.",
  },
  {
    _id: "criticalThinking",
    icon: stepIconMap.criticalThinking,
    discipline: "Critical Thinking",
    type: "dayEntry",
    title: "What problem might I face today and how can I approach it?",
    description:
      "Problem Solving - Anticipate and prepare solutions in advance.",
  },
  {
    _id: "adaptability",
    icon: stepIconMap.adaptability,
    discipline: "adaptability",
    type: "dayEntry",
    title: "What new thing will I try today?",
    description: "New Skill - Try something outside your comfort zone.",
  },
  {
    _id: "selfAwareness",
    icon: stepIconMap.selfAwareness,
    discipline: "Self Awareness",
    type: "nightEntry",
    title: "What did I learn about myself today?",
    description: "Daily Reflection - Journal about thoughts and emotions.",
  },
  {
    _id: "courage",
    icon: stepIconMap.courage,
    discipline: "courage",
    type: "dayEntry",
    title: "What fear will I face today?",
    description:
      "Facing Fear - Intend to do something challenging and reflect later.",
  },
  {
    _id: "vitality",
    icon: stepIconMap.vitality,
    discipline: "vitality",
    type: "dayEntry",
    title: "How will I care for my body today?",
    description: "Health Check - Plan exercise, meals, or rest.",
  },
  {
    _id: "innovation",
    icon: stepIconMap.innovation,
    discipline: "innovation",
    type: "dayEntry",
    title: "What will I create today?",
    description:
      "Creativity - Set intention for a creative task like drawing or writing.",
  },
  {
    _id: "charisma",
    icon: stepIconMap.charisma,
    discipline: "charisma",
    type: "dayEntry",
    title: "Who will I connect with today?",
    description:
      "Social Connection - Intentionally plan a meaningful interaction.",
  },
  {
    _id: "timeManagement",
    icon: stepIconMap.timeManagement,
    discipline: "Time Management",
    type: "dayEntry",
    title: "How will I manage my time today?",
    description: "Time Management - Plan your priorities and key tasks.",
  },
  {
    _id: "emotionalMastery",
    icon: stepIconMap.emotionalMastery,
    discipline: "Emotional Mastery",
    type: "nightEntry",
    title: "Write about a moment when you managed your emotions well",
    description:
      "Emotional Regulation - Reflect on emotional responses and self-control.",
  },
  {
    _id: "mentalClarity",
    icon: stepIconMap.mentalClarity,
    discipline: "Mental Clarity",
    type: "dayEntry",
    title: "What is one thing clouding your focus today?",
    description:
      "Clear Thinking - Identify mental clutter and reduce distractions.",
  },
  {
    _id: "selfCompassion",
    icon: stepIconMap.selfCompassion,
    discipline: "Self Compassion",
    type: "nightEntry",
    title: "Write a kind note to yourself",
    description:
      "Self-Compassion - Practice treating yourself with empathy and kindness.",
  },
  {
    _id: "delayedGratification",
    icon: stepIconMap.delayedGratification,
    discipline: "Delayed Gratification",
    type: "dayEntry",
    title: "What short-term urge will I resist today?",
    description:
      "Willpower Training - Strengthen discipline by delaying impulses.",
  },
  {
    _id: "integrity",
    icon: stepIconMap.integrity,
    discipline: "Integrity",
    type: "nightEntry",
    title: "Did your actions reflect your values today?",
    description: "Values Check - Align your behavior with core beliefs.",
  },
  {
    _id: "happiness",
    icon: stepIconMap.happiness,
    discipline: "Happiness",
    type: "dayEntry",
    title: "What are 3 things I’ll enjoy today?",
    description:
      "Joy Sparking - Anticipate and focus on small positive moments.",
  },
  {
    _id: "mentalFlexibility",
    icon: stepIconMap.mentalFlexibility,
    discipline: "Mental Flexibility",
    type: "nightEntry",
    title: "How would someone else view your challenge?",
    description:
      "Perspective Shift - Gain insight by reframing your viewpoint.",
  },
  {
    _id: "concentration",
    icon: stepIconMap.concentration,
    discipline: "Concentration",
    type: "dayEntry",
    title: "What task will I give full focus to today?",
    description: "Focus Training - Plan and execute deep work sessions.",
  },
  {
    _id: "lettingGo",
    icon: stepIconMap.lettingGo,
    discipline: "Letting Go",
    type: "nightEntry",
    title: "What’s one thing you chose to release today?",
    description: "Emotional Release - Let go of tension, anger, or control.",
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
