"use client";

import { useSideContent } from "@context/SideContentContext";
import { useEffect, useState } from "react";

export function useDrawerPosition() {
  const { isDrawerOpen } = useSideContent();
  const [drawerStyle, setDrawerStyle] = useState({});

  useEffect(() => {
    if (isDrawerOpen) {
      setDrawerStyle({
        // NOTE: SideContent width is set to 45%
        // no clue, bit it doesn't break
        // need to make a calc here, somehow?
        left: "39.5%",
      });
    } else {
      setDrawerStyle({
        left: "0",
      });
    }
  }, [isDrawerOpen]);

  return drawerStyle;
}
