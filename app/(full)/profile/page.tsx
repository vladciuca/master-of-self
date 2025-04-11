"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Disciplines } from "@components/profile/disciplines/Disciplines";
import { WeeklyWillpowerChart } from "@components/profile/weekly-willpower-chart/WeeklyWillpowerChart";
import { UserHabits } from "@components/habits/UserHabits";

export default function Profile() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Tab configuration object - contains name and component for each tab
  const tabConfig = [
    {
      name: "Willpower",
      component: <WeeklyWillpowerChart />,
    },
    {
      name: "Disciplines",
      component: <Disciplines />,
    },
    {
      name: "Habits",
      component: <UserHabits />,
    },
  ];

  // Default tab the first tab in the config, unless specified in URL
  const defaultTab = tabConfig[0].name;
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    // Get tab from URL or use default
    const tabFromUrl = searchParams.get("page");
    const isValidTab = tabConfig.some((tab) => tab.name === tabFromUrl);

    if (tabFromUrl && isValidTab) {
      setActiveTab(tabFromUrl);
    } else {
      setActiveTab(defaultTab);
    }
  }, [searchParams]);

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);

    // Update URL with the new tab
    router.push(`?page=${tabName}`, { scroll: false });
  };

  return (
    <div className="flex flex-col pb-4">
      <div className="sticky top-0 z-10 bg-background pt-0 shadow-sm">
        <div className="py-4 flex space-x-2">
          {tabConfig.map((tab) => (
            <Button
              key={tab.name}
              size="sm"
              variant={activeTab === tab.name ? "default" : "outline"}
              onClick={() => handleTabChange(tab.name)}
              className="flex-shrink-0 text-xs rounded-full"
            >
              {tab.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Render the active tab's component */}
      {tabConfig.find((tab) => tab.name === activeTab)?.component}
    </div>
  );
}
