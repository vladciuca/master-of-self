import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createJournalEntry } from "@lib/mongo/journal-entries";
import { JournalEntryHabit } from "@models/types";

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    dailyWillpower,
    bonusWillpower,
    habits,
  }: {
    dailyWillpower: number;
    bonusWillpower: number;
    habits: JournalEntryHabit;
  } = await req.json();

  const userToday = req.nextUrl.searchParams.get("today");

  if (!userToday) {
    return NextResponse.json(
      { error: "'today' parameter is required" },
      { status: 400 }
    );
  }

  try {
    const { newJournalEntry, error } = await createJournalEntry(
      userId,
      dailyWillpower,
      bonusWillpower,
      userToday,
      habits
    );

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(newJournalEntry, { status: 201 });
  } catch (error) {
    console.error("Error creating new journal entry:", error);
    return NextResponse.json(
      { error: "Failed to create new journal entry" },
      { status: 500 }
    );
  }
}
