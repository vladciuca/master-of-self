import { NextResponse } from "next/server";
// import { hash } from "bcryptjs";
// import clientPromise from "@/lib/mongo/mongodb";
// import { ObjectId } from "mongodb";

// export async function POST(req: Request) {
//   try {
//     const { email, password, name } = await req.json();
//     const hashedPassword = await hash(password, 12);

//     const client = await clientPromise;
//     const db = client.db();

//     const existingUser = await db.collection("users").findOne({ email });

//     if (existingUser) {
//       return NextResponse.json(
//         { message: "User already exists" },
//         { status: 400 }
//       );
//     }

//     const result = await db.collection("users").insertOne({
//       email,
//       password: hashedPassword,
//       name,
//       settings: {
//         steps: {
//           gratitude: false,
//           reflection: false,
//         },
//         journalStartTime: {
//           morning: "08:00",
//           evening: "18:00",
//         },
//         lastUpdateTime: null,
//       },
//     });

//     return NextResponse.json(
//       { message: "User created successfully", userId: result.insertedId },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Signup error:", error);
//     return NextResponse.json(
//       { message: "An error occurred during sign up" },
//       { status: 500 }
//     );
//   }
// }
