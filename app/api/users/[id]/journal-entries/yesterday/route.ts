import { NextRequest, NextResponse } from "next/server";
import { getYesterdaysJournalEntry } from "@lib/mongo/journal-entries";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  const userToday = req.nextUrl.searchParams.get("today");
  const userYesterday = req.nextUrl.searchParams.get("yesterday");

  // Check if both parameters are provided
  if (!userToday || !userYesterday) {
    return NextResponse.json(
      { error: "Both 'today' and 'yesterday' parameters are required" },
      { status: 400 }
    );
  }

  try {
    const { yesterdaysJournalEntry, error } = await getYesterdaysJournalEntry(
      userId,
      userToday,
      userYesterday
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
