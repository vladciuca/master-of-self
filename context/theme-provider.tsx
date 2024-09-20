"use client";

import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Layout } from "@app/types/types";

type ThemeProviderProps = Layout &
  React.ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
