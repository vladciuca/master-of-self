"use client";

import { PageTabs } from "@components/ui/page-tabs";
import { PracticeExplore } from "@components/practices/PracticeExplore";

export default function Community() {
  return (
    <PageTabs
      tabs={[
        {
          name: "Practices",
          component: <PracticeExplore />,
        },
        {
          name: "People",
          component: <div />,
        },
      ]}
    />
  );
}
