"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { WeeklyWillpowerChart } from "@components/profile/weekly-willpower-chart/WeeklyWillpowerChart";
import { UserDisciplines } from "@components/disciplines/UserDisciplines";
// import { UserHabits } from "@components/habits/UserHabits";

export default function Profile() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // page tab configuration object - contains name and component for each page
  const pageConfig = [
    {
      name: "disciplines",
      component: <UserDisciplines />,
    },
    {
      name: "willpower",
      component: <WeeklyWillpowerChart />,
    },
    // {
    //   name: "habits",
    //   component: <UserHabits />,
    // },
  ];

  // Default page the first page in the config, unless specified in URL
  const defaultPage = pageConfig[0].name;
  const [activePage, setActivePage] = useState(defaultPage);

  useEffect(() => {
    // Get page from URL or use default
    const pageFromUrl = searchParams.get("page");
    const isValidPage = pageConfig.some((page) => page.name === pageFromUrl);

    if (pageFromUrl && isValidPage) {
      setActivePage(pageFromUrl);
    } else {
      setActivePage(defaultPage);
    }
  }, [searchParams]);

  const handlePageChange = (pageName: string) => {
    setActivePage(pageName);

    // Update URL with the new page
    router.push(`?page=${pageName}`, { scroll: false });
  };

  return (
    <div className="flex flex-col pb-1">
      <div className="sticky top-0 z-10 bg-background pt-0 shadow-sm">
        <div className="py-4 flex space-x-2">
          {pageConfig.map((page) => (
            <Button
              key={page.name}
              size="sm"
              variant={activePage === page.name ? "secondary" : "outline"}
              onClick={() => handlePageChange(page.name)}
              className="flex-shrink-0 text-xs rounded-full capitalize"
            >
              {page.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Render the active page's component */}
      {pageConfig.find((page) => page.name === activePage)?.component}
    </div>
  );
}
