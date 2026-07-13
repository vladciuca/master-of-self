import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUser, updateUserProfile } from "@lib/mongo/users";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const routeParams = await params;
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user, error } = await getUser(routeParams.id);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    if (!user) return new NextResponse("User not found", { status: 404 });

    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return new NextResponse(
      JSON.stringify({ message: "Failed to fetch user profile" }),
      { status: 500 }
    );
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const routeParams = await params;
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (userId !== routeParams.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updateData = await req.json();

    const { user, error } = await updateUserProfile(userId, updateData);

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

    return new NextResponse(JSON.stringify({ profile: user.profile }), {
      status: 200,
    });
  } catch (error) {
    console.error("Failed to update user profile:", error);
    return new NextResponse(
      JSON.stringify({ message: "Failed to update user profile" }),
      { status: 500 }
    );
  }
};
