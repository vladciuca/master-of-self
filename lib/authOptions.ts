import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { Adapter } from "next-auth/adapters";
import clientPromise from "@lib/mongo/mongodb";
import { Session, User } from "@app/types/types";

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
  // callbacks: {
  //   async redirect({ url, baseUrl }) {
  //     if (url.startsWith("/")) return `${baseUrl}${url}`;
  //     else if (new URL(url).origin === baseUrl) return url;
  //     return baseUrl;
  //   },
  // },
};
