import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createPractice } from "@lib/mongo/practices";
import { JournalStepType } from "@models/types";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      discipline,
      icon,
      color,
      type,
      title,
      description,
    }: {
      discipline: string;
      icon: string;
      color: string;
      type: JournalStepType;
      title: string;
      description: string;
    } = await req.json();

    const { newPractice, error } = await createPractice(
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

    return new NextResponse(JSON.stringify(newPractice), { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new NextResponse(
      `Failed to create new practice: ${message}`,
      {
        status: 500,
      }
    );
  }
}
