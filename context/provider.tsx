"use client";

import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Layout } from "@models/types";

export function Provider({ children }: Layout) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
