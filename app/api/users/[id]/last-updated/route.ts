import { NextRequest, NextResponse } from "next/server";
import {
  getUserLastUpdateTime,
  updateUserLastUpdateTime,
} from "@/lib/mongo/users";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const lastUpdateTime = await getUserLastUpdateTime(id);

    return NextResponse.json(
      { lastUpdateTime: lastUpdateTime || null },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch user last update time:", error);
    return NextResponse.json(
      { error: "Failed to fetch user last update time" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const { updateTime } = await req.json();

    if (!updateTime) {
      return NextResponse.json(
        { error: "Update time is required" },
        { status: 400 }
      );
    }

    await updateUserLastUpdateTime(userId, updateTime);

    return NextResponse.json(
      { message: "Last update time updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update user last update time:", error);
    return NextResponse.json(
      { error: "Failed to update user last update time" },
      { status: 500 }
    );
  }
}
