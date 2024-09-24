import { NextRequest, NextResponse } from "next/server";
import { getTotalWillpower } from "lib/mongo/journal-entries";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  try {
    const { totalWillpower, error } = await getTotalWillpower(userId);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(
      { totalWillpower: totalWillpower },
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
