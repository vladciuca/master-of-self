"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Community } from "@components/disciplines/Community";
import { PreMade } from "@components/disciplines/PreMade";

export default function Profile() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // page tab configuration object - contains name and component for each page
  const pageConfig = [
    {
      name: "pre-made",
      component: <PreMade />,
    },
    {
      name: "Community",
      component: <Community />,
    },
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

  //NOTE: the buttons needs to be extracted in a reusable component
  return (
    <div className="flex flex-col pb-1">
      <div className="sticky top-0 z-10 bg-background pt-0">
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
