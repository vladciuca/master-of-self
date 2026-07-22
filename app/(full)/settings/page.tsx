"use client";

import { PageTabs } from "@components/ui/page-tabs";
import { MobileSideContent } from "components/side-content/MobileSideContent";
import { DiscordPage } from "@components/side-content/community/DiscordPage";
import { useScreenSize } from "@hooks/useScreenSize";

export default function Settings() {
  const isLargeScreen = useScreenSize();

  // Only show tabs on small/medium screens - on large screens this
  // content lives in the side panel
  const tabs = !isLargeScreen
    ? [
        {
          name: "About",
          component: <MobileSideContent innerMenu={true} />,
        },
        {
          name: "Community",
          component: (
            <DiscordPage
              isDrawerOpen={true}
              handleCloseDrawer={() => {}}
              isMobile={true}
            />
          ),
        },
      ]
    : [];

  return <PageTabs tabs={tabs} />;
}
