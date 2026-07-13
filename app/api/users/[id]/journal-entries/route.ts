import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getJournalEntries } from "lib/mongo/journal-entries";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const routeParams = await params;

  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (userId !== routeParams.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { journalEntries, error } = await getJournalEntries(userId);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    if (!journalEntries) {
      return NextResponse.json(
        { error: "No journal entries found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { journalEntries: journalEntries },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
