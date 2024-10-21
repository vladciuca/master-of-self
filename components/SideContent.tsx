"use client";

import { useState } from "react";
import { Button } from "@components/ui/button";
import { FaEye, FaBookmark } from "react-icons/fa";
import { GiBlackBook, GiWhiteBook, GiBookCover } from "react-icons/gi";
import { Target, Shell } from "lucide-react";
import { useSideContent } from "@context/SideContentContext";
import { LandingPage } from "./landing-page/LandingPage";

// TEMP: Define tab components
const LoopComponent = () => <div>Journal Loop Component</div>;
const HabitsComponent = () => <div>Habits Component</div>;
const GoalsComponent = () => <div>Goals Component</div>;

const tabs = [
  { id: "vision", icon: FaEye, label: "Vision", component: LandingPage },
  {
    id: "journal",
    icon: GiBookCover,
    label: "Journal",
    component: LoopComponent,
  },
  { id: "habits", icon: Target, label: "Habits", component: HabitsComponent },
  { id: "goals", icon: Shell, label: "Goals", component: GoalsComponent },
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
              isDrawerOpen ? "py-6 px-2" : "py-10 px-12"
            } ${
              activeTab === tab.id && isDrawerOpen
                ? "bg-primary"
                : "bg-background hover:bg-primary text-primary hover:text-background"
            } flex items-center justify-start`}
            onClick={() => handleTabClick(tab.id)}
          >
            <tab.icon className={`${!isDrawerOpen ? "mr-6" : ""}`} size={34} />
            {!isDrawerOpen && <span className="ml-4 text-lg">{tab.label}</span>}
          </Button>
        ))}
      </div>
    </>
  );
}
