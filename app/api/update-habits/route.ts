import { NextRequest, NextResponse } from "next/server";
import { updateHabitsXp, updateHabitsActions } from "@/lib/mongo/habits";
import { HabitUpdate, HabitActionUpdate } from "@/app/types/mongodb";
import { getYesterdaysJournalEntry } from "@/lib/mongo/journal-entries";
import { getToday, getYesterday } from "@/lib/time";
import { calculateHabitsXpSumsFromActions } from "@/lib/level";
import { JournalEntry } from "@/app/types/types";
import {
  getUserLastUpdateTime,
  updateUserLastUpdateTime,
} from "@/lib/mongo/users";

async function updateHabits(userId: string) {
  const today = getToday();
  const yesterday = getYesterday();

  // Check if habits have already been updated today
  const lastUpdateTime = await getUserLastUpdateTime(userId);
  if (lastUpdateTime && lastUpdateTime === today.toISOString().split("T")[0]) {
    return { message: "Habits already updated today" };
  }

  console.log("AM TRECUT DE CHECK");

  // Get yesterday's journal entry
  const { yesterdaysJournalEntry, error: journalError } =
    (await getYesterdaysJournalEntry(
      userId,
      today.toISOString(),
      yesterday.toISOString()
    )) as { yesterdaysJournalEntry: JournalEntry | null; error: any };

  if (journalError) {
    console.error(
      `Error fetching yesterday's journal entry for user ${userId}:`,
      journalError
    );
    throw new Error("Failed to fetch journal entry");
  }

  if (yesterdaysJournalEntry) {
    if (
      yesterdaysJournalEntry.nightEntry?.actions &&
      Object.keys(yesterdaysJournalEntry.nightEntry?.actions).length > 0
    ) {
      console.log("AM TRECUT DE CHECK SI SUNT IN YDAY ENTRY");

      const habitActionsValues: HabitActionUpdate =
        yesterdaysJournalEntry.nightEntry.actions;

      // GET HABIT XP VALUES FROM via Y_DAYS ENTRY DATA
      const habitXpFromActions = calculateHabitsXpSumsFromActions(
        habitActionsValues,
        yesterdaysJournalEntry.dailyWillpower
      );

      // SET HABIT XP UPDATE VALUES TO ARR
      const habitsXpUpdate: HabitUpdate[] = Object.entries(habitXpFromActions);

      // Update habit XP
      const { error: xpError } = await updateHabitsXp(habitsXpUpdate);
      // Update habit ACTIONS
      const { error: actionError } = await updateHabitsActions(
        habitActionsValues
      );

      if (xpError) {
        console.error(`Error updating XP for user ${userId}:`, xpError);
      }

      if (actionError) {
        console.error(
          `Error updating actions for user ${userId}:`,
          actionError
        );
      }
    }

    // Update the last update time for the user
    await updateUserLastUpdateTime(userId, today.toISOString().split("T")[0]);

    return { message: "Habits updated successfully" };
  } else {
    return { message: "No journal entry found for yesterday" };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const result = await updateHabits(userId);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error in habit update:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json(
    { message: "Use POST method to update habits" },
    { status: 200 }
  );
}
