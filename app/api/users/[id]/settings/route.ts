import { NextRequest, NextResponse } from "next/server";
// import { connectToDB } from "@lib/mongoose";
import User from "@models/user";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    // await connectToDB();

    const user = await User.findById(params.id);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify({ settings: user.settings }), {
      status: 200,
    });
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
    // await connectToDB();

    const userId = params.id;
    const updateData = await req.json();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // Update the user settings
    if (updateData.steps) {
      user.settings.steps = { ...user.settings.steps, ...updateData.steps };
    }
    if (updateData.journalStartTime) {
      user.settings.journalStartTime = {
        ...user.settings.journalStartTime,
        ...updateData.journalStartTime,
      };
    }

    await user.save();

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
