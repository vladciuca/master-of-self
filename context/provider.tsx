"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { Session, Layout } from "@app/types/types";

type ProviderProps = Layout & {
  session: any;
};

export function Provider({ children, session }: ProviderProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
