import { NextRequest, NextResponse } from "next/server";
import { createJournalEntry } from "@lib/mongo/journal-entries";

export async function POST(req: NextRequest) {
  const { userId, dailyWillpower, bonusWillpower, dayEntry, nightEntry } =
    await req.json();
  // Get the date from query parameters
  const date = req.nextUrl.searchParams.get("date");

  // If no date is provided, use the current date
  const userDate = date ? new Date(date) : new Date();
  const isoDate = userDate.toISOString().split("T")[0];

  // Validate the date
  if (isNaN(userDate.getTime())) {
    return NextResponse.json(
      { error: "Invalid date provided" },
      { status: 400 }
    );
  }

  try {
    const { newJournalEntry, error } = await createJournalEntry(
      userId,
      dailyWillpower,
      bonusWillpower,
      dayEntry,
      nightEntry,
      isoDate
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
