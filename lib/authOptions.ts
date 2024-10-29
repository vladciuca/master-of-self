import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { Adapter } from "next-auth/adapters";
import { ObjectId } from "mongodb";
import clientPromise from "@lib/mongo/mongodb";
import { Session } from "@app/types/types";

async function updateHabits(userId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/update-habits`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      }
    );
    console.log("==== DUPA FETCH");
    if (!response.ok) {
      console.log("==== EROARE");
      console.error("Failed to update habits on login");
    } else {
      console.log("==== UPDATE FLAG");
      console.log("Habits updated successfully");
    }
  } catch (error) {
    console.error("Error updating habits on login:", error);
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise) as Adapter,
  callbacks: {
    session: async ({ session, user }: any) => {
      if (session?.user) {
        session.user.id = user.id;
        // Trigger habit update here
        await updateHabits(user.id);
      }
      return session as Session;
    },
  },
  events: {
    createUser: async ({ user }) => {
      const db = (await clientPromise).db();
      await db.collection("users").updateOne(
        { _id: new ObjectId(user.id) },
        {
          $set: {
            settings: {
              steps: {
                gratefulStep: false,
                reflectionStep: false,
              },
              journalStartTime: {
                morning: "08:00",
                evening: "18:00",
              },
            },
          },
        }
      );
    },
  },
};
