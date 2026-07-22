"use client";

import { PageTabs } from "@components/ui/page-tabs";
import { WeeklyWillpowerChart } from "@components/profile/weekly-willpower-chart/WeeklyWillpowerChart";
import { DisciplineXpBars } from "@components/profile/DisciplineXpBars";
import { PracticeOverview } from "@components/profile/PracticeOverview";
import { DaySplit } from "@components/profile/DaySplit";
import { SignOut } from "@components/profile/SignOut";

export default function Profile() {
  return (
    <PageTabs
      tabs={[
        {
          name: "practices",
          component: <PracticeOverview />,
        },
        {
          name: "disciplines",
          component: <DisciplineXpBars />,
        },
        {
          name: "willpower",
          component: <WeeklyWillpowerChart />,
        },
        {
          name: "settings",
          component: (
            <div className="flex flex-col space-y-10 pb-4">
              <DaySplit />
              <SignOut />
            </div>
          ),
        },
      ]}
    />
  );
}
