"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { Layout } from "@models/types";

export function Provider({ children }: Layout) {
  return <SessionProvider>{children}</SessionProvider>;
}
