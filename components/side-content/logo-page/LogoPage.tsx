"use client";

import { PageLogo } from "@components/PageLogo";

type LogoPageProps = {
  isDrawerOpen: boolean;
  handleCloseDrawer: () => void;
  isMobile?: boolean;
};

export function LogoPage(_props: LogoPageProps) {
  return (
    <div className="h-full w-full">
      <PageLogo />
    </div>
  );
}
