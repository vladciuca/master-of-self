import { NextRequest, NextResponse } from "next/server";
import { getTodaysJournalEntry } from "@lib/mongo/journal-entries";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  try {
    const { todaysJournalEntry, error } = await getTodaysJournalEntry(userId);

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
