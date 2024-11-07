import { NextRequest, NextResponse } from "next/server";
import { getLastJournalEntry } from "@lib/mongo/journal-entries";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  try {
    const { lastJournalEntry, error } = await getLastJournalEntry(userId);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ lastJournalEntry }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
