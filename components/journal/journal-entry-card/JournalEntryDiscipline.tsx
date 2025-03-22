import { calculateStepScore } from "@lib/score";
import type { JournalDayEntry, JournalNightEntry } from "@models/types";

type JournalEntryDisciplineProps = {
  dayEntry: JournalDayEntry;
  nightEntry: JournalNightEntry;
};

export function JournalEntryDiscipline({
  dayEntry,
  nightEntry,
}: JournalEntryDisciplineProps) {
  console.log("=====dayEntry", dayEntry);
  console.log("=====nightEntry", nightEntry);

  const positivity = calculateStepScore(dayEntry?.gratefulFor || []);
  const motivation = calculateStepScore(dayEntry?.greatToday || []);
  const awareness = calculateStepScore(nightEntry?.dailyHighlights || []);
  const resilience = calculateStepScore(nightEntry?.learnedToday || []);

  return (
    <div>
      <span>positivity:{positivity}</span>
      <span>motivation:{motivation}</span>
      <span>awareness:{awareness}</span>
      <span>resilience:{resilience}</span>
    </div>
  );
}
