import { NextRequest, NextResponse } from "next/server";
import { createJournalEntry } from "@lib/mongo/journal-entries";

export async function POST(req: NextRequest) {
  const { userId, dailyWillpower, bonusWillpower, dayEntry, nightEntry } =
    await req.json();

  try {
    const { newJournalEntry, error } = await createJournalEntry(
      userId,
      dailyWillpower,
      bonusWillpower,
      dayEntry,
      nightEntry
    );

    if (error) {
      return new NextResponse(error, { status: 500 });
    }

    return new NextResponse(JSON.stringify(newJournalEntry), { status: 200 });
  } catch (error) {
    console.error("Error creating new journal entry:", error);
    return new NextResponse("Failed to create new journal entry", {
      status: 500,
    });
  }
}
