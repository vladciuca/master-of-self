"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { UserProfileOverview } from "@components/profile/UserProfileOverview";
import { MobileSideContent } from "components/side-content/MobileSideContent";

import { DaySplit } from "@components/profile/DaySplit";
import { ThemeToggle } from "@components/profile/ThemeToggle";
import { SignOut } from "@components/profile/SignOut";

import { Button } from "@/components/ui/button";
import { Session } from "@models/types";

export default function Settings() {
  const { data: session } = useSession() as { data: Session | null };
  const searchParams = useSearchParams();
  const router = useRouter();

  // page tab configuration object - contains name and component for each page
  const pageConfig = [
    {
      name: "Overview",
      component: (
        <UserProfileOverview userId={session?.user.id} notCurrentUser={false} />
      ),
    },
    {
      name: "Settings",
      component: (
        <div className="flex flex-col space-y-10 pb-4">
          <DaySplit />
          <ThemeToggle />
          <SignOut />
        </div>
      ),
    },
    {
      name: "About",
      component: <MobileSideContent innerMenu={true} />,
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
