// import { NextRequest } from "next/server";
// import { connectToDB } from "@lib/database";
// import Habit from "@models/habit";

// export const GET = async (
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) => {
//   try {
//     await connectToDB();

//     const habits = await Habit.find({
//       creator: params.id,
//     }).populate("creator");

//     return new Response(JSON.stringify(habits), { status: 200 });
//   } catch (error) {
//     return new Response("Failed to fetch all habits", { status: 500 });
//   }
// };

import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@lib/database";
import Habit from "@models/habit";
import corsMiddleware from "@lib/cors-middleware";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  // Create a NextResponse object to pass to the CORS middleware
  const res = NextResponse.next();

  try {
    // Apply CORS middleware
    await corsMiddleware(req as any, res as any);

    // Connect to the database
    await connectToDB();

    // Fetch habits
    const habits = await Habit.find({
      creator: params.id,
    }).populate("creator");

    // Return the response
    return NextResponse.json(habits, { status: 200 });
  } catch (error) {
    // In case of an error, still apply CORS headers
    await corsMiddleware(req as any, res as any);
    return NextResponse.json("Failed to fetch all habits", { status: 500 });
  }
};
