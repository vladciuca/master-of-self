import { NextRequest, NextResponse } from "next/server";
import { getPracticesByIds } from "lib/mongo/practices";

export async function POST(request: NextRequest) {
  try {
    // Get practice IDs from request body
    const { practiceIds } = await request.json();

    if (!Array.isArray(practiceIds) || practiceIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid request. practiceIds must be a non-empty array." },
        { status: 400 }
      );
    }

    // Fetch the practice details for the provided IDs
    const { practices, error: practicesError } = await getPracticesByIds(
      practiceIds
    );

    if (practicesError) {
      return NextResponse.json({ error: practicesError }, { status: 500 });
    }

    return NextResponse.json(
      { practices: practices || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching practices by IDs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
