"use client";

import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { LandingPage } from "./landing-page/LandingPage";
import { HowItWorks } from "./how-it-works/HowItWorks";
import { CTAPage } from "./call-to-action-page/CTAPage";
import { DiscordPage } from "./community/DiscordPage";
import { FloatingMobileMenu } from "./FloatingMobileMenu";
import { FaEye, FaBrain } from "react-icons/fa";
import { FaGear, FaDiscord } from "react-icons/fa6";

const allTabs = [
  {
    id: "cta",
    icon: FaEye,
    label: "PLAY NOW",
    component: CTAPage,
  },
  {
    id: "landing",
    icon: FaBrain,
    label: "GAME LOOP",
    component: LandingPage,
  },
  {
    id: "science",
    icon: FaGear,
    label: "HOW IT WORKS",
    component: HowItWorks,
  },
  {
    id: "community",
    icon: FaDiscord,
    label: "COMMUNITY",
    component: DiscordPage,
    // bgColor: "bg-indigo-500",
  },
];

// Memoized content component to prevent unnecessary re-renders
const ContentArea = ({ activeTab }: { activeTab: string }) => {
  const ActiveComponent = useMemo(() => {
    return (
      allTabs.find((tab) => tab.id === activeTab)?.component || LandingPage
    );
  }, [activeTab]);

  return (
    <div className="h-full w-full">
      <ActiveComponent
        isDrawerOpen={true}
        handleCloseDrawer={() => {}}
        isMobile={true}
      />
    </div>
  );
};

export function MobileSideContent({ innerMenu }: { innerMenu?: boolean }) {
  const { data: session, status } = useSession();

  // const tabs = useMemo(() => {
  //   return allTabs.filter((tab) => {
  //     if (tab.id === "cta" && status === "authenticated") {
  //       return false;
  //     }
  //     return true;
  //   });
  // }, [status]);
  const tabs = useMemo(() => {
    return allTabs.filter((tab) => {
      if (tab.id === "cta" && status === "authenticated") {
        return false;
      }
      if (tab.id === "community" && innerMenu) {
        return false;
      }
      return true;
    });
  }, [status, innerMenu]);

  const [activeTab, setActiveTab] = useState(() => tabs[0]?.id || "landing");

  // Update activeTab if the current one is no longer available
  useMemo(() => {
    if (!tabs.find((tab) => tab.id === activeTab)) {
      setActiveTab(tabs[0]?.id || "landing");
    }
  }, [tabs, activeTab]);

  return (
    <div className="relative h-full w-full">
      <FloatingMobileMenu
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        innerMenu={innerMenu}
      />
      <ContentArea activeTab={activeTab} />
    </div>
  );
}
