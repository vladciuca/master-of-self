"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface SideContentContextType {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isOpen: boolean) => void;
}

const SideContentContext = createContext<SideContentContextType | undefined>(
  undefined
);

export function SideContentProvider({ children }: { children: ReactNode }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <SideContentContext.Provider value={{ isDrawerOpen, setIsDrawerOpen }}>
      {children}
    </SideContentContext.Provider>
  );
}

export function useSideContent() {
  const context = useContext(SideContentContext);
  if (context === undefined) {
    throw new Error("useSideContent must be used within a SideContentProvider");
  }
  return context;
}
