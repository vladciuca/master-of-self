import { NextRequest, NextResponse } from "next/server";
import { getJourney, deleteJourney } from "@lib/mongo/journeys";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { journey, error } = await getJourney(params.id);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    if (!journey) return new NextResponse("Journey not found", { status: 404 });

    return new NextResponse(JSON.stringify(journey), { status: 200 });
  } catch (error) {
    return new NextResponse("Failed to fetch journey", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { success, error } = await deleteJourney(params.id);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success }, { status: 200 });
  } catch (error) {
    return new NextResponse("Failed to delete journey", { status: 500 });
  }
}
