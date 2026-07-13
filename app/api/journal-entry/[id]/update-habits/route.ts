import { NextResponse, NextRequest } from "next/server";
import { updateJournalEntryHabits } from "@lib/mongo/journal-entries";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const routeParams = await params;
  const { habits } = await req.json();

  try {
    const { journalEntry, error } = await updateJournalEntryHabits(
      routeParams.id,
      habits
    );

    if (error) {
      return NextResponse.json({ error }, { status: 404 });
    }

    return NextResponse.json(journalEntry, { status: 200 });
  } catch (error) {
    console.error("API error updating journal entry habits:", error);
    return NextResponse.json(
      { error: "Failed to update journal entry habits" },
      { status: 500 }
    );
  }
}
