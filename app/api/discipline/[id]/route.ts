import { NextRequest, NextResponse } from "next/server";
import { getDiscipline, updateDiscipline } from "@lib/mongo/disciplines";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { discipline, error } = await getDiscipline(params.id);

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
  { params }: { params: { id: string } }
) {
  const { discipline, icon, color, type, title, description } =
    await req.json();

  try {
    //NOTE: inconsistent name: disciplineStep
    //this will return disciplineStep.discipline,
    //maybe change to 'name' > discipline.name!?
    const { disciplineStep, error } = await updateDiscipline(
      params.id,
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
