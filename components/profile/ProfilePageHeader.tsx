"use client";

import { useRouter } from "next/navigation";
import { Button } from "@components/ui/button";
import { Plus } from "lucide-react";

type ProfilePageHeaderProps = {
  symbol: JSX.Element;
  title: string;
  linkTo: string;
  itemsCount: number | string;
  disabled?: boolean;
};

export function ProfilePageHeader({
  symbol,
  title,
  linkTo,
  itemsCount,
  disabled = false,
}: ProfilePageHeaderProps) {
  const router = useRouter();

  const handleClick = () => {
    if (!disabled) {
      router.push(linkTo);
    }
  };

  return (
    <div className="sticky top-[68px] z-10 bg-background px-1 pb-2">
      <div className="flex items-center justify-end">
        {/* <div className="text-4xl flex items-center font-bold">
          <span className="mr-2">{symbol}</span>
          {itemsCount}
        </div> */}

        <div className="flex items-center">
          <span className="scroll-m-20 tracking-tight">Create {title}</span>
          <Button
            onClick={handleClick}
            disabled={disabled}
            variant="secondary"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full ml-3"
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Create {title}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
