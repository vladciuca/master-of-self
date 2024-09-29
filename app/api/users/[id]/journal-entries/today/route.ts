import { NextRequest, NextResponse } from "next/server";
import { getTodaysJournalEntry } from "@lib/mongo/journal-entries";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  const today = req.nextUrl.searchParams.get("today");
  const tomorrow = req.nextUrl.searchParams.get("tomorrow");

  // If no date is provided, use the current date
  const userToday = today ? new Date(today) : new Date();
  const userTomorrow = tomorrow ? new Date(tomorrow) : new Date();

  // Validate the date
  if (isNaN(userToday.getTime()) || isNaN(userTomorrow.getTime())) {
    return NextResponse.json(
      { error: "Invalid date provided" },
      { status: 400 }
    );
  }

  try {
    const { todaysJournalEntry, error } = await getTodaysJournalEntry(
      userId,
      userToday.toISOString().split("T")[0],
      userTomorrow.toISOString().split("T")[0]
    );

    if (error) {
      return new NextResponse(error, { status: 500 });
    }

    return new NextResponse(JSON.stringify(todaysJournalEntry), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to fetch today's journal entry", {
      status: 500,
    });
  }
}
