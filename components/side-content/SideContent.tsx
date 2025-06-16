"use client";

import { useState } from "react";
import { LandingPage } from "./landing-page/LandingPage";
import { HowItWorks } from "./how-it-works/HowItWorks";
import { CTAPage } from "./call-to-action-page/CTAPage";
import { Button } from "@components/ui/button";
import { FaEye, FaBrain } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import {
  // GiSpellBook,
  GiBookCover,
} from "react-icons/gi";
import { useSideContent } from "@context/SideContentContext";

const tabs = [
  {
    id: "cta",
    icon: FaEye,
    label: "New Game",
    component: CTAPage,
  },
  {
    id: "landing",
    icon: FaBrain,
    label: "Game Loop",
    component: LandingPage,
  },
  {
    id: "science",
    icon: FaGear,
    label: "How it works",
    component: HowItWorks,
  },

  // {
  //   id: "journal",
  //   icon: GiBookCover,
  //   label: "Game Loop",
  //   component: JournalPage,
  // },
  // { id: "vision", icon: FaEye, label: "Vision", component: VisionPage },
  // {
  //   id: "identity",
  //   icon: GiCharacter,
  //   label: "Identity",
  //   component: IdentityPage,
  // },
];

export function SideContent() {
  const { isDrawerOpen, setIsDrawerOpen } = useSideContent();
  const [activeTab, setActiveTab] = useState(tabs[0].id);

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

  return (
    <>
      <div
        className={`relative hidden lg:block h-full bg-background rounded-tr-xl rounded-br-xl transition-all duration-300 ease-in-out ${
          isDrawerOpen ? "w-[80%]" : "w-0 overflow-hidden"
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
            {!isDrawerOpen && <span className="ml-6 text-lg">{tab.label}</span>}
          </Button>
        ))}
      </div>
    </>
  );
}
