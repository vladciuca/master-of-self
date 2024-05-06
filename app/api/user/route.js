import { connectToDB } from "@utils/database";
import User from "@models/user";

export const GET = async (req) => {
  try {
    await connectToDB();

    const email = req.nextUrl.searchParams.get("email");

    if (!email) {
      throw new Error("Email parameter is missing");
    }

    const userResource = await User.findOne({ email });

    if (!userResource) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(userResource), { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to fetch user data",
        error: error.message,
      }),
      { status: 500 }
    );
  }
};
