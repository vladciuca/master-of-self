import { NextRequest, NextResponse } from "next/server";
import { createJournalEntry } from "@lib/mongo/journal-entries";

export async function POST(req: NextRequest) {
  const { userId, dailyWillpower, bonusWillpower } = await req.json();

  const userToday = req.nextUrl.searchParams.get("today");
  const userTomorrow = req.nextUrl.searchParams.get("tomorrow");

  // Check if both parameters are provided
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
