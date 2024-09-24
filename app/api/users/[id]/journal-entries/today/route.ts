import { NextRequest, NextResponse } from "next/server";
import { getTodaysJournalEntry } from "@lib/mongo/journal-entries";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
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
    const { todaysJournalEntry, error } = await getTodaysJournalEntry(
      userId,
      isoDate
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
