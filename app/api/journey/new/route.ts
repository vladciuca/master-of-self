// import { NextRequest, NextResponse } from "next/server";
// import { createJourney } from "@lib/mongo/journeys";

// export async function POST(req: NextRequest) {
//   const { userId, roadmapData } = await req.json();

//   try {
//     // Validate roadmapData structure
//     if (!roadmapData || !roadmapData.title || !roadmapData.roadmap) {
//       return new NextResponse("Invalid roadmap data structure", {
//         status: 400,
//       });
//     }

//     const { newJourney, error } = await createJourney(userId, roadmapData);

//     if (error) {
//       return new NextResponse(error, { status: 500 });
//     }

//     return new NextResponse(JSON.stringify(newJourney), { status: 200 });
//   } catch (error: any) {
//     return new NextResponse(`Failed to create new journey: ${error.message}`, {
//       status: 500,
//     });
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { createJourney } from "@lib/mongo/journeys";
// You might also need to import your new RoadmapData type here for clarity,
// though TypeScript might infer it if you're using it consistently.
// import { RoadmapData } from "@your-project-root/types/roadmap-common";

export async function POST(req: NextRequest) {
  // Add type assertion if you import RoadmapData, helps with Intellisense
  const { userId, roadmapData /* : RoadmapData */ } = await req.json();

  try {
    // Validate roadmapData structure based on the NEW types
    if (!roadmapData || !roadmapData.title || !roadmapData.milestones) {
      // <--- Changed from .roadmap to .milestones
      return new NextResponse(
        "Invalid roadmap data structure: missing title or milestones array.",
        {
          status: 400,
        }
      );
    }

    // You might also want to add more robust validation, e.g.:
    if (
      typeof roadmapData.title !== "string" ||
      roadmapData.title.trim() === "" ||
      !Array.isArray(roadmapData.milestones) ||
      roadmapData.milestones.length === 0
      // Add checks for totalMilestones, timeUnit, totalDuration if they are strictly required
    ) {
      return new NextResponse(
        "Roadmap data missing required fields or has invalid types.",
        {
          status: 400,
        }
      );
    }

    // Ensure your createJourney function is also updated to accept the new RoadmapData type
    // If createJourney internally relies on the old structure, it will also need updating.
    const { newJourney, error } = await createJourney(userId, roadmapData);

    if (error) {
      // You might want to stringify the error if it's an object from createJourney
      return new NextResponse(
        typeof error === "string" ? error : JSON.stringify(error),
        { status: 500 }
      );
    }

    return new NextResponse(JSON.stringify(newJourney), { status: 200 });
  } catch (error: any) {
    // Keep error: any or error: unknown for catch block
    return new NextResponse(
      `Failed to create new journey: ${error.message || error}`,
      {
        // Safely access message
        status: 500,
      }
    );
  }
}
