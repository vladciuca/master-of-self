"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { LandingPage } from "./landing-page/LandingPage";
import { HowItWorks } from "./how-it-works/HowItWorks";
import { CTAPage } from "./call-to-action-page/CTAPage";
import { Button } from "@components/ui/button";
import { FaEye, FaBrain } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { useSideContent } from "@context/SideContentContext";

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

export function SideContent() {
  const { data: session, status } = useSession();
  const { isDrawerOpen, setIsDrawerOpen } = useSideContent();
  const [isVisible, setIsVisible] = useState(false);

  const tabs = allTabs.filter((tab) => {
    if (tab.id === "cta" && status === "authenticated") {
      return false; // Hide "New Game" tab when logged in
    }
    return true;
  });

  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "landing");

  // Reset activeTab if current tab is no longer available
  useEffect(() => {
    const isCurrentTabAvailable = tabs.some((tab) => tab.id === activeTab);
    if (!isCurrentTabAvailable && tabs.length > 0) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  // Animate in after loading is complete
  useEffect(() => {
    if (status !== "loading") {
      // Small delay to ensure DOM is ready, then trigger animation
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleTabClick = (tabId: string) => {
    if (tabId === activeTab && isDrawerOpen) {
      setIsDrawerOpen(false);
    } else {
      setActiveTab(tabId);
      setIsDrawerOpen(true);
    }
  };

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || LandingPage;

  if (status === "loading") return <></>;

  return (
    <>
      <div
        className={`relative hidden lg:block h-full bg-background rounded-tr-xl rounded-br-xl transition-all duration-300 ease-in-out ${
          isDrawerOpen ? "w-[80%]" : "w-0 overflow-hidden"
        } ${
          isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-28 scale-80"
        }`}
      >
        <div
          className={`z-20 h-full transition-opacity duration-100 ease-in-out ${
            isDrawerOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <ActiveComponent
            isDrawerOpen={isDrawerOpen}
            handleCloseDrawer={() => setIsDrawerOpen(false)}
          />
        </div>
      </div>
      <div
        className={`absolute ${
          isDrawerOpen ? "left-[45%] space-y-4" : "left-4 space-y-2"
        } top-4 transition-all duration-300 ease-in-out z-50 lg:flex hidden flex-col`}
      >
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            size="lg"
            className={`transition-all duration-300 ease-in-out ${
              isDrawerOpen ? "py-6 px-2" : "py-10 px-10"
            } ${
              activeTab === tab.id && isDrawerOpen
                ? "bg-primary"
                : "bg-background hover:bg-primary text-primary hover:text-background"
            } flex items-center justify-start`}
            onClick={() => handleTabClick(tab.id)}
          >
            <tab.icon size={34} />
            {!isDrawerOpen && (
              <span className="ml-6 tracking-wider">
                {tab.label.split(" ").map((word, wordIndex) => (
                  <span key={wordIndex}>
                    <span className="text-xl">{word.charAt(0)}</span>
                    <span className="text-md font-semibold">
                      {word.slice(1)}
                    </span>
                    {wordIndex < tab.label.split(" ").length - 1 && " "}
                  </span>
                ))}
              </span>
            )}
          </Button>
        ))}
      </div>
    </>
  );
}
