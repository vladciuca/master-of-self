import { NextRequest, NextResponse } from "next/server";
import { getYesterdaysJournalEntry } from "@lib/mongo/journal-entries";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  try {
    const { yesterdaysJournalEntry, error } = await getYesterdaysJournalEntry(
      userId
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
