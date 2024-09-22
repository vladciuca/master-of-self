import { NextRequest, NextResponse } from "next/server";
import { getUser, updateUserSettings } from "@lib/mongo/users";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const id = params.id;

    const { user, error } = await getUser(id);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    if (!user) return new NextResponse("User not found", { status: 404 });

    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch user settings:", error);
    return new NextResponse(
      JSON.stringify({ message: "Failed to fetch user settings" }),
      { status: 500 }
    );
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const userId = params.id;
    const updateData = await req.json();

    const { user, error } = await updateUserSettings(userId, updateData);

    if (error) {
      return new NextResponse(JSON.stringify({ message: error }), {
        status: 500,
      });
    }

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify({ settings: user.settings }), {
      status: 200,
    });
  } catch (error) {
    console.error("Failed to update user settings:", error);
    return new NextResponse(
      JSON.stringify({ message: "Failed to update user settings" }),
      { status: 500 }
    );
  }
};
