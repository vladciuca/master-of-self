import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPractice, updatePractice, deletePractice } from "@lib/mongo/practices";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const routeParams = await params;
  try {
    const { practice, error } = await getPractice(routeParams.id);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    if (!practice)
      return new NextResponse("Practice not found", { status: 404 });

    return new NextResponse(JSON.stringify(practice), { status: 200 });
  } catch (error) {
    return new NextResponse("Failed to fetch practice", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const routeParams = await params;
  const { discipline, icon, color, type, title, description } =
    await req.json();

  try {
    const { practiceStep, error } = await updatePractice(
      routeParams.id,
      discipline,
      icon,
      color,
      type,
      title,
      description
    );

    if (error) {
      return new NextResponse(error, { status: 404 });
    }

    return new NextResponse(JSON.stringify(practiceStep), { status: 200 });
  } catch (error) {
    return new NextResponse("Failed to update practice", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const routeParams = await params;
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { success, error } = await deletePractice(routeParams.id, userId);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success }, { status: 200 });
  } catch (error) {
    return new NextResponse("Failed to delete practice", { status: 500 });
  }
}
