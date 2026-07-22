"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PillTabs } from "@components/ui/pill-tabs";
import type { ReactNode } from "react";

export type PageTab = {
  name: string;
  component: ReactNode;
};

export function PageTabs({ tabs }: { tabs: PageTab[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const defaultPage = tabs[0]?.name ?? "";
  const [activePage, setActivePage] = useState(defaultPage);

  useEffect(() => {
    const pageFromUrl = searchParams.get("page");
    const isValidPage = tabs.some((tab) => tab.name === pageFromUrl);

    if (pageFromUrl && isValidPage) {
      setActivePage(pageFromUrl);
    } else {
      setActivePage(defaultPage);
    }
  }, [searchParams, tabs, defaultPage]);

  const handlePageChange = (pageName: string) => {
    setActivePage(pageName);
    router.push(`?page=${pageName}`, { scroll: false });
  };

  if (tabs.length === 0) return null;

  return (
    <div className="flex flex-col pb-1">
      <div className="sticky top-0 z-10 bg-background pt-0">
        <div className="py-4">
          <PillTabs
            options={tabs.map((tab) => tab.name)}
            activeOption={activePage}
            onSelect={handlePageChange}
          />
        </div>
      </div>

      {tabs.find((tab) => tab.name === activePage)?.component}
    </div>
  );
}
