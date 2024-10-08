import { NextRequest, NextResponse } from "next/server";
import { createJournalEntry } from "@lib/mongo/journal-entries";

export async function POST(req: NextRequest) {
  const { userId, dailyWillpower, bonusWillpower } = await req.json();

  const userToday = req.nextUrl.searchParams.get("today");
  const userTomorrow = req.nextUrl.searchParams.get("tomorrow");

  if (!userToday || !userTomorrow) {
    return NextResponse.json(
      { error: "Both 'today' and 'tomorrow' parameters are required" },
      { status: 400 }
    );
  }

  try {
    const { newJournalEntry, error } = await createJournalEntry(
      userId,
      dailyWillpower,
      bonusWillpower,
      userToday,
      userTomorrow
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
