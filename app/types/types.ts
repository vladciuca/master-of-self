import { Session as NextAuthSession } from "next-auth";

export type User = {
  id: string;
  name?: string;
  email?: string;
};

export type Session = NextAuthSession & {
  user: User;
};
