"use client";

import { useSideContent } from "@context/SideContentContext";
import { useEffect, useState } from "react";

export function useDrawerPosition() {
  const { isDrawerOpen } = useSideContent();
  const [drawerStyle, setDrawerStyle] = useState({});

  useEffect(() => {
    if (isDrawerOpen) {
      setDrawerStyle({
        left: "50%",
      });
    } else {
      setDrawerStyle({});
    }
  }, [isDrawerOpen]);

  return { drawerStyle };
}
