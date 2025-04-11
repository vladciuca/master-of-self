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
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-center">
            {title}
          </h1>
          <Button
            onClick={handleClick}
            disabled={disabled}
            variant="secondary"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full mx-3"
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add new {title}</span>
          </Button>
        </div>
        <div className="text-4xl flex items-center font-bold">
          <span className="mr-2">{symbol}</span>
          {itemsCount}
        </div>
      </div>
    </div>
  );
}
