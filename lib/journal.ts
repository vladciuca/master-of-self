import type { JournalDayEntry, JournalNightEntry } from "@models/types";

export function hasEntryContent(
  entry?: JournalDayEntry | JournalNightEntry
): boolean {
  return Object.values(entry ?? {}).some((arr) => (arr ?? []).length > 0);
}
