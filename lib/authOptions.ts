import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { Adapter } from "next-auth/adapters";
import { ObjectId } from "mongodb";
import clientPromise from "@lib/mongo/mongodb";
import { Session } from "@app/types/types";

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
  // callbacks: {
  //   async redirect({ url, baseUrl }) {
  //     if (url.startsWith("/")) return `${baseUrl}${url}`;
  //     else if (new URL(url).origin === baseUrl) return url;
  //     return baseUrl;
  //   },
  // },
};
