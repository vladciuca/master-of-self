"use client";

import { useEffect, useState } from "react";
import { useSideContent } from "@context/SideContentContext";
import { useScreenSize } from "@hooks/useScreenSize";

export function useSideContentPosition() {
  const { isDrawerOpen } = useSideContent();
  const isLargeScreen = useScreenSize();
  const [drawerStyle, setDrawerStyle] = useState({});
  const [alertDialogStyle, setAlertDialogStyle] = useState({});

  useEffect(() => {
    if (isLargeScreen && isDrawerOpen) {
      setDrawerStyle({
        left: "44.5%",
      });
      setAlertDialogStyle({
        left: "72.25%",
      });
    } else {
      setDrawerStyle({});
      setAlertDialogStyle({});
    }
  }, [isDrawerOpen, isLargeScreen]);

  return { drawerStyle, alertDialogStyle };
}
