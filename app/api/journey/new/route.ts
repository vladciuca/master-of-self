import { NextRequest, NextResponse } from "next/server";
import { createJourney } from "@lib/mongo/journeys";

export async function POST(req: NextRequest) {
  const { userId, roadmapData } = await req.json();

  try {
    // Validate roadmapData structure
    if (!roadmapData || !roadmapData.title || !roadmapData.roadmap) {
      return new NextResponse("Invalid roadmap data structure", {
        status: 400,
      });
    }

    const { newJourney, error } = await createJourney(userId, roadmapData);

    if (error) {
      return new NextResponse(error, { status: 500 });
    }

    return new NextResponse(JSON.stringify(newJourney), { status: 200 });
  } catch (error: any) {
    return new NextResponse(`Failed to create new journey: ${error.message}`, {
      status: 500,
    });
  }
}
