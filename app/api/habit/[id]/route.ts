import { NextRequest, NextResponse } from "next/server";
import { getHabit, updateHabit, deleteHabit } from "@lib/mongo/habits";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const routeParams = await params;
  try {
    const { habit, error } = await getHabit(routeParams.id);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    if (!habit) return new NextResponse("Habit not found", { status: 404 });

    return new NextResponse(JSON.stringify(habit), { status: 200 });
  } catch (error) {
    return new NextResponse("Failed to fetch habit", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const routeParams = await params;
  const { name, icon, actions } = await req.json();

  try {
    const { habit, error } = await updateHabit(routeParams.id, name, icon, actions);

    if (error) {
      return new NextResponse(error, { status: 404 });
    }

    return new NextResponse(JSON.stringify(habit), { status: 200 });
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
    const { success, error } = await deleteHabit(routeParams.id);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success }, { status: 200 });
  } catch (error) {
    return new NextResponse("Failed to delete habit", { status: 500 });
  }
}
