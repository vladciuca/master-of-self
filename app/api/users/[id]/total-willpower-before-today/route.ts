import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getTotalWillpowerBeforeToday } from "lib/mongo/journal-entries";

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
      { error: "Parameter 'today' is required" },
      { status: 400 }
    );
  }

  try {
    const { totalWillpowerBeforeToday, error } =
      await getTotalWillpowerBeforeToday(userId, userToday);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(
      { totalWillpowerBeforeToday: totalWillpowerBeforeToday },
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
