import { NextRequest, NextResponse } from "next/server";
import { getJourneys } from "lib/mongo/journeys";

// GET - Retrieve all journeys for a user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  try {
    const { journeys, error } = await getJourneys(userId);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    if (!journeys) {
      return NextResponse.json({ error: "No journeys found" }, { status: 404 });
    }

    return NextResponse.json({ journeys: journeys }, { status: 200 });
  } catch (error) {
    console.error("Error fetching journeys:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
