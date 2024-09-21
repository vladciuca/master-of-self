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
import { corsMiddleware } from "@lib/cors-middleware";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  // Apply CORS middleware
  const corsHeaders = corsMiddleware(req);

  try {
    // Connect to the database
    await connectToDB();

    // Fetch habits
    const habits = await Habit.find({
      creator: params.id,
    }).populate("creator");

    // Return the response with CORS headers
    return new NextResponse(JSON.stringify(habits), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Failed to fetch habits:", error);
    // Return error response with CORS headers
    return new NextResponse("Failed to fetch all habits", {
      status: 500,
      headers: corsHeaders,
    });
  }
};
