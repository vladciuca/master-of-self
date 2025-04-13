import { NextRequest, NextResponse } from "next/server";
import { createDiscipline } from "@lib/mongo/disciplines";

export async function POST(req: NextRequest) {
  const { userId, discipline, icon, color, type, title, description } =
    await req.json();

  console.log("===color", color);
  try {
    const { newDiscipline, error } = await createDiscipline(
      userId,
      discipline,
      icon,
      color,
      type,
      title,
      description
    );

    if (error) {
      return new NextResponse(error, { status: 500 });
    }

    return new NextResponse(JSON.stringify(newDiscipline), { status: 200 });
  } catch (error: any) {
    return new NextResponse(
      `Failed to create new discipline: ${error.message}`,
      {
        status: 500,
      }
    );
  }
}
