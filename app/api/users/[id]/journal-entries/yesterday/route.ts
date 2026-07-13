import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getYesterdaysJournalEntry } from "@lib/mongo/journal-entries";

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
