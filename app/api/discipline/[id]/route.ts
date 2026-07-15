import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDiscipline, updateDiscipline, deleteDiscipline } from "@lib/mongo/disciplines";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const routeParams = await params;
  try {
    const { discipline, error } = await getDiscipline(routeParams.id);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    if (!discipline)
      return new NextResponse("Discipline not found", { status: 404 });

    return new NextResponse(JSON.stringify(discipline), { status: 200 });
  } catch (error) {
    return new NextResponse("Failed to fetch discipline", { status: 500 });
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
    //NOTE: inconsistent name: disciplineStep
    //this will return disciplineStep.discipline,
    //maybe change to 'name' > discipline.name!?
    const { disciplineStep, error } = await updateDiscipline(
      routeParams.id,
      //caused by 'discipline' key
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

    return new NextResponse(JSON.stringify(disciplineStep), { status: 200 });
  } catch (error) {
    return new NextResponse("Failed to update habit", { status: 500 });
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

    const { success, error } = await deleteDiscipline(routeParams.id, userId);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success }, { status: 200 });
  } catch (error) {
    return new NextResponse("Failed to delete discipline", { status: 500 });
  }
}
