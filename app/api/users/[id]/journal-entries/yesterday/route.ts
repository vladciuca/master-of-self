import { NextRequest, NextResponse } from "next/server";
import { getYesterdaysJournalEntry } from "@lib/mongo/journal-entries";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  const userYesterday = req.nextUrl.searchParams.get("yesterday");

  if (!userYesterday) {
    return NextResponse.json(
      { error: "'yesterday' parameter is required" },
      { status: 400 }
    );
  }

  try {
    const { yesterdaysJournalEntry } = await getYesterdaysJournalEntry(
      userId,
      userYesterday
    );

    return NextResponse.json({ yesterdaysJournalEntry }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
