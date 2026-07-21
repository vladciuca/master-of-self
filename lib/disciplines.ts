import { stepIconMap } from "@components/ui/constants";
import type { JournalCustomStepConfig } from "@models/types";

// The base "Discipline" practice is built into the app (Commit & Review)
// and must never appear as an addable practice in feeds.
export const BASE_DISCIPLINE_ID = "discipline";

export const DISCIPLINES: JournalCustomStepConfig[] = [
  {
    _id: "awareness",
    icon: stepIconMap.awareness,
    discipline: "Awareness",
    type: "nightEntry",
    title: "Where did I act without awareness today?",
    description:
      "Better understand yourself through reflection, mindfulness, and honest observation. Create practices that help you notice your thoughts, emotions, behaviors, and personal growth.\n\nExamples: Daily Reflection, Meditation, Emotional Check-in, Self Awareness, Lessons Learned",
    color: "#3BA7F0",
  },
  {
    _id: "discipline",
    icon: stepIconMap.discipline,
    discipline: "Discipline",
    type: "dayEntry",
    title: "What will I commit to today?",
    description:
      "Build consistency through intentional action and daily follow-through. Every small step strengthens your ability to turn intention into habit.",
    color: "#F4C542",
  },
  {
    _id: "courage",
    icon: stepIconMap.courage,
    discipline: "Courage",
    type: "dayEntry",
    title: "What discomfort will I face today?",
    description:
      "Build the confidence to face fear, discomfort, and meaningful challenges. Create practices that encourage growth by stepping outside your comfort zone.\n\nExamples: Face Your Fears, Difficult Conversations, Take a Risk, Leave Your Comfort Zone, Challenge Yourself",
    color: "#E74C3C",
  },
  {
    _id: "gratitude",
    icon: stepIconMap.gratitude,
    discipline: "Gratitude",
    type: "dayEntry",
    title: "What am I grateful for today?",
    description:
      "Appreciate the people, experiences, and moments that make life meaningful. Create practices that help you recognize the good and develop a more positive outlook.\n\nExamples: Gratitude Journal, Daily Wins, Appreciation, Positive Moments, Thankfulness",
    color: "#F5A623",
  },
  {
    _id: "wisdom",
    icon: stepIconMap.wisdom,
    discipline: "Wisdom",
    type: "nightEntry",
    title: "What did I learn today?",
    description:
      "Learn from experience and improve your judgment over time. Create practices that help you think deeply, solve problems, and make better decisions.\n\nExamples: Critical Thinking, Decision Reviews, Reading Notes, Problem Solving, Daily Insights",
    color: "#6C63FF",
  },
  {
    _id: "compassion",
    icon: stepIconMap.compassion,
    discipline: "Compassion",
    type: "dayEntry",
    title: "How will I show kindness today?",
    description:
      "Strengthen your relationships through kindness, empathy, forgiveness, and understanding. Create practices that help you care for both yourself and others.\n\nExamples: Acts of Kindness, Self Compassion, Forgiveness, Relationships, Helping Others",
    color: "#EC5A8C",
  },
  {
    _id: "creativity",
    icon: stepIconMap.creativity,
    discipline: "Creativity",
    type: "dayEntry",
    title: "What will I create or explore today?",
    description:
      "Explore ideas, express yourself, and create something meaningful. Create practices that encourage imagination, experimentation, and original thinking.\n\nExamples: Brainstorming, Writing, Drawing, Music, Personal Projects",
    color: "#C04CF5",
  },
  {
    _id: "vitality",
    icon: stepIconMap.vitality,
    discipline: "Vitality",
    type: "dayEntry",
    title: "How will I care for my body today?",
    description:
      "Care for your physical and mental well-being by building healthy routines that increase your energy and resilience.\n\nExamples: Exercise, Sleep, Nutrition, Recovery, Hydration",
    color: "#20B26B",
  },
  {
    _id: "purpose",
    icon: stepIconMap.purpose,
    discipline: "Purpose",
    type: "nightEntry",
    title: "Did my actions align with what matters most?",
    description:
      "Align your daily actions with your values and long-term direction. Create practices that keep you focused on the life you want to build.\n\nExamples: Personal Values, Vision, Life Goals, Future Planning, Meaningful Work",
    color: "#FFD84D",
  },
];

export default DISCIPLINES;
