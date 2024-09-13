"use client";

import { SessionProvider } from "next-auth/react";
import { Layout, Session } from "@/app/types/types";

type ProviderProps = Layout & {
  session?: Session | null | undefined;
};

export default function Provider({ children, session }: ProviderProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
