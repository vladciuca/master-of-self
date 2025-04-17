import { NextRequest, NextResponse } from "next/server";
import { getDisciplinesByIds } from "lib/mongo/disciplines";

export async function POST(request: NextRequest) {
  try {
    // Get discipline IDs from request body
    const { disciplineIds } = await request.json();

    if (!Array.isArray(disciplineIds) || disciplineIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid request. disciplineIds must be a non-empty array." },
        { status: 400 }
      );
    }

    // Fetch the discipline details for the provided IDs
    const { disciplines, error: disciplinesError } = await getDisciplinesByIds(
      disciplineIds
    );

    if (disciplinesError) {
      return NextResponse.json({ error: disciplinesError }, { status: 500 });
    }

    return NextResponse.json(
      { disciplines: disciplines || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching disciplines by IDs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
