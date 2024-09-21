import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User, { UserInterface } from "@models/user";
import { connectToDB } from "@lib/database";
import { Session, User as UserType } from "@app/types/types";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ session }): Promise<Session> {
      if (session.user && session.user.email) {
        const sessionUser = await User.findOne({ email: session.user.email });
        if (sessionUser) {
          return {
            ...session,
            user: {
              ...session.user,
              id: sessionUser._id.toString(),
            } as UserType,
          };
        }
      }
      return session as Session;
    },
    async signIn({ profile }) {
      if (!profile || !profile.email) {
        console.error("Invalid or missing profile data:", profile);
        return false;
      }
      try {
        await connectToDB();
        // check if a user already exists
        const userExists = await User.findOne({ email: profile.email });
        //if not, create a new user
        if (!userExists && profile.email) {
          await User.create({
            email: profile.email,
            username: profile.name,
            image: profile.image,
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
          } as UserInterface);
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
};
