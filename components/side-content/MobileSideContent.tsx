"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { LandingPage } from "./landing-page/LandingPage";
import { HowItWorks } from "./how-it-works/HowItWorks";
import { CTAPage } from "./call-to-action-page/CTAPage";
import { Button } from "@components/ui/button";
import { FaEye, FaBrain, FaChevronUp, FaChevronDown } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";

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
];

// Alternative: Collapsible floating menu
export function MobileSideContent() {
  const { data: session, status } = useSession();
  const [isExpanded, setIsExpanded] = useState(false);

  const tabs = allTabs.filter((tab) => {
    if (tab.id === "cta" && status === "authenticated") {
      return false;
    }
    return true;
  });

  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "landing");

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsExpanded(false); // Collapse after selection
  };

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || LandingPage;
  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="relative h-full w-full">
      {/* Floating Menu Button */}
      <div className="absolute top-4 right-4 z-50">
        {!isExpanded ? (
          // Collapsed state - show active tab
          <div className="flex flex-col items-center space-y-2">
            <Button
              size="lg"
              className="w-14 h-14 rounded-2xl p-0 bg-primary/40 text-primary-foreground shadow-lg"
              onClick={() => setIsExpanded(true)}
            >
              {activeTabData && <activeTabData.icon size={22} />}
            </Button>
            <FaChevronUp
              className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
              size={12}
              onClick={() => setIsExpanded(true)}
            />
          </div>
        ) : (
          // Expanded state - show all tabs
          <div className="flex flex-col items-center space-y-2">
            <FaChevronDown
              className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors mb-1"
              size={12}
              onClick={() => setIsExpanded(false)}
            />
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                size="lg"
                className={`w-14 h-14 rounded-2xl p-0 transition-all duration-200 ease-in-out shadow-lg ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground border-primary/30 scale-105"
                    : "bg-background/90 text-foreground hover:bg-primary hover:text-primary-foreground border-border/50"
                }`}
                onClick={() => handleTabClick(tab.id)}
              >
                <tab.icon size={22} />
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="h-full w-full">
        <ActiveComponent
          isDrawerOpen={true}
          handleCloseDrawer={() => {}}
          isMobile={true}
        />
      </div>
    </div>
  );
}
