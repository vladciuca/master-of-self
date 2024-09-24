import { NextRequest, NextResponse } from "next/server";
import { getYesterdaysJournalEntry } from "@lib/mongo/journal-entries";

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
    const { yesterdaysJournalEntry, error } = await getYesterdaysJournalEntry(
      userId,
      isoDate
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
