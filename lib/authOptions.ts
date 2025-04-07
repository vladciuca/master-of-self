import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// import InstagramProvider from "next-auth/providers/instagram";
// import FacebookProvider from "next-auth/providers/facebook";
// import TwitterProvider from "next-auth/providers/twitter";
import GitHubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { Adapter } from "next-auth/adapters";
import { ObjectId } from "mongodb";
import clientPromise from "@lib/mongo/mongodb";
import { Session } from "@models/types";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // InstagramProvider({
    //   clientId: process.env.INSTAGRAM_ID as string,
    //   clientSecret: process.env.INSTAGRAM_CLIENT_SECRET as string,
    // }),
    // FacebookProvider({
    //   clientId: process.env.INSTAGRAM_ID as string,
    //   clientSecret: process.env.INSTAGRAM_CLIENT_SECRET as string,
    // }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise) as Adapter,
  callbacks: {
    session: async ({ session, user }: any) => {
      if (session?.user) {
        session.user.id = user.id;
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
            profile: {
              // steps: {
              //   gratitude: true,
              //   reflection: true,
              //   affirmations: true,
              // },
              disciplines: {
                motivation: 0,
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
