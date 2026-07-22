import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { updatePracticeOrder } from "lib/mongo/users";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const routeParams = await params;

  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (userId !== routeParams.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { practiceOrder } = await request.json();

    if (!Array.isArray(practiceOrder)) {
      return NextResponse.json(
        { error: "Invalid request. Required: practiceOrder (string array)" },
        { status: 400 }
      );
    }

    const result = await updatePracticeOrder(userId, practiceOrder);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: "Practice order updated successfully",
        practiceOrder: result.user?.profile.practiceOrder || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating practice order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
