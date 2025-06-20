"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
// import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { TbChevronCompactDown, TbChevronCompactUp } from "react-icons/tb";

interface FloatingMenuProps {
  tabs: Array<{
    id: string;
    icon: React.ComponentType<{ size: number }>;
    label: string;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  innerMenu?: boolean;
}

export function FloatingMobileMenu({
  tabs,
  activeTab,
  onTabChange,
  innerMenu = false,
}: FloatingMenuProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setIsExpanded(false);
  };

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div
      className={`${
        innerMenu ? "sticky top-20" : "absolute top-4"
      } right-4 z-50`}
    >
      <div className="flex justify-end">
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
            <TbChevronCompactUp
              className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
              size={20}
              onClick={() => setIsExpanded(true)}
            />
          </div>
        ) : (
          // Expanded state - show all tabs
          <div className="flex flex-col items-center space-y-2">
            <TbChevronCompactDown
              className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors mb-1"
              size={20}
              onClick={() => setIsExpanded(false)}
            />

            {tabs.map((tab) => (
              <Button
                key={tab.id}
                size="lg"
                className={`w-14 h-14 rounded-2xl p-0 transition-all duration-200 ease-in-out shadow-lg ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground border-primary/30 scale-105"
                    : "bg-background/90 text-foreground hover:bg-primary hover:text-primary-foreground border-2 border-primary/90"
                }`}
                onClick={() => handleTabClick(tab.id)}
              >
                <tab.icon size={22} />
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
