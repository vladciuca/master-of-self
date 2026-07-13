import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getTodaysJournalEntry } from "@lib/mongo/journal-entries";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const routeParams = await params;

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (userId !== routeParams.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const userToday = req.nextUrl.searchParams.get("today");

  if (!userToday) {
    return NextResponse.json(
      { error: "'today' parameter is required" },
      { status: 400 }
    );
  }

  try {
    const { todaysJournalEntry } = await getTodaysJournalEntry(
      userId,
      userToday
    );

    return NextResponse.json({ todaysJournalEntry }, { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch today's journal entry", {
      status: 500,
    });
  }
}
