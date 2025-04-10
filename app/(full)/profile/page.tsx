"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Disciplines } from "@components/profile/disciplines/Disciplines";
import { WeeklyWillpowerChart } from "@components/profile/weekly-willpower-chart/WeeklyWillpowerChart";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("Disciplines");
  const tabs = ["Disciplines", "Willpower"];

  return (
    <div className="flex flex-col space-y-4 pb-4">
      <div className="sticky top-0 z-10 bg-background pt-0 shadow-sm">
        <div className="py-4 flex space-x-2">
          {tabs.map((tab) => (
            <Button
              key={tab}
              size="sm"
              variant={activeTab === tab ? "default" : "outline"}
              onClick={() => setActiveTab(tab)}
              className="flex-shrink-0 text-xs rounded-full"
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>

      {activeTab === "Disciplines" && <Disciplines />}
      {activeTab === "Willpower" && <WeeklyWillpowerChart />}
    </div>
  );
}
