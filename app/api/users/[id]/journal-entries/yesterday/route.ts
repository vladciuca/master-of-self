import { NextRequest, NextResponse } from "next/server";
import { getYesterdaysJournalEntry } from "@lib/mongo/journal-entries";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  const today = req.nextUrl.searchParams.get("today");
  const yesterday = req.nextUrl.searchParams.get("tomorrow");

  // If no date is provided, use the current date
  const userToday = today ? new Date(today) : new Date();
  const userYesterday = yesterday ? new Date(yesterday) : new Date();

  // Validate the date
  if (isNaN(userToday.getTime()) || isNaN(userYesterday.getTime())) {
    return NextResponse.json(
      { error: "Invalid date provided" },
      { status: 400 }
    );
  }

  try {
    const { yesterdaysJournalEntry, error } = await getYesterdaysJournalEntry(
      userId,
      userToday.toISOString().split("T")[0],
      userYesterday.toISOString().split("T")[0]
    );

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }

    return new NextResponse(JSON.stringify(yesterdaysJournalEntry), {
      status: 200,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
