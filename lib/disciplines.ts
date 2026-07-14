import { DISCIPLINE_COLORS } from "@lib/colors";
import { stepIconMap } from "@components/ui/constants";
import type { JournalCustomStepConfig } from "@models/types";

export const DISCIPLINES: JournalCustomStepConfig[] = [
  {
    _id: "awareness",
    icon: stepIconMap.awareness,
    discipline: "Awareness",
    type: "nightEntry",
    title: "Where did I act without awareness today?",
    description:
      "Mindfulness reflection – notice where you reacted on autopilot and returned to presence.",
    color: DISCIPLINE_COLORS.sky,
  },
  {
    _id: "discipline",
    icon: stepIconMap.discipline,
    discipline: "Discipline",
    type: "dayEntry",
    title: "What will I commit to today?",
    description:
      "Execution check – set one clear commitment and the habit that supports it.",
    color: DISCIPLINE_COLORS.slate,
  },
  {
    _id: "courage",
    icon: stepIconMap.courage,
    discipline: "Courage",
    type: "dayEntry",
    title: "What discomfort will I face today?",
    description:
      "Facing fear – choose one challenging action and step toward it.",
    color: DISCIPLINE_COLORS.red,
  },
  {
    _id: "gratitude",
    icon: stepIconMap.gratitude,
    discipline: "Gratitude",
    type: "dayEntry",
    title: "What am I grateful for today?",
    description:
      "Gratitude practice – reflect on something you appreciate and why it matters.",
    color: DISCIPLINE_COLORS.amber,
  },
  {
    _id: "wisdom",
    icon: stepIconMap.wisdom,
    discipline: "Wisdom",
    type: "nightEntry",
    title: "What did I learn today?",
    description:
      "Learning review – capture a lesson, insight, or better perspective from today.",
    color: DISCIPLINE_COLORS.indigo,
  },
  {
    _id: "compassion",
    icon: stepIconMap.compassion,
    discipline: "Compassion",
    type: "dayEntry",
    title: "How will I show kindness today?",
    description:
      "Kindness intention – plan a small act of empathy or connection.",
    color: DISCIPLINE_COLORS.rose,
  },
  {
    _id: "creativity",
    icon: stepIconMap.creativity,
    discipline: "Creativity",
    type: "dayEntry",
    title: "What will I create or explore today?",
    description:
      "Creative practice – make space for an idea, expression, or experiment.",
    color: DISCIPLINE_COLORS.fuchsia,
  },
  {
    _id: "vitality",
    icon: stepIconMap.vitality,
    discipline: "Vitality",
    type: "dayEntry",
    title: "How will I care for my body today?",
    description:
      "Health check – plan movement, nourishment, rest, or energy care.",
    color: DISCIPLINE_COLORS.emerald,
  },
  {
    _id: "purpose",
    icon: stepIconMap.purpose,
    discipline: "Purpose",
    type: "nightEntry",
    title: "Did my actions align with what matters most?",
    description:
      "Values alignment – reflect on meaning, direction, and the person you want to become.",
    color: DISCIPLINE_COLORS.yellow,
  },
];

export default DISCIPLINES;
