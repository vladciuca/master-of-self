"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { Layout } from "@app/types/types";

export function Provider({ children }: Layout) {
  return <SessionProvider>{children}</SessionProvider>;
}
