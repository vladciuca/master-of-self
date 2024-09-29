import { NextRequest, NextResponse } from "next/server";
import { getTodaysJournalEntry } from "@lib/mongo/journal-entries";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
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
    const { todaysJournalEntry, error } = await getTodaysJournalEntry(
      userId,
      userToday,
      userTomorrow
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
