import { NextRequest, NextResponse } from "next/server";
import { getCurrentWillpower } from "lib/mongo/journal-entries";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  const userToday = req.nextUrl.searchParams.get("today");

  if (!userToday) {
    return NextResponse.json(
      { error: "Parameter 'today' is required" },
      { status: 400 }
    );
  }

  try {
    const { currentWillpower, error } = await getCurrentWillpower(
      userId,
      userToday
    );

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(
      { currentWillpower: currentWillpower },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching total willpower:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
