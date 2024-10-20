"use client";

import { useEffect, useState } from "react";
import { useSideContent } from "@context/SideContentContext";
import { useScreenSize } from "@hooks/useScreenSize";

export function useDrawerPosition() {
  const { isDrawerOpen } = useSideContent();
  const isLargeScreen = useScreenSize();
  const [drawerStyle, setDrawerStyle] = useState({});

  useEffect(() => {
    if (isLargeScreen && isDrawerOpen) {
      setDrawerStyle({
        left: "50%",
      });
    } else {
      setDrawerStyle({});
    }
  }, [isDrawerOpen, isLargeScreen]);

  return { drawerStyle };
}
