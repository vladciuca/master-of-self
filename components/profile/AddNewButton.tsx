"use client";

import { useRouter } from "next/navigation";
import { Button } from "@components/ui/button";
import { Plus } from "lucide-react";

type AddNewButtonProps = {
  title: string;
  linkTo: string;
  disabled?: boolean;
  size?: number;
};

export function AddNewButton({
  title,
  linkTo,
  disabled = false,
  size = 6,
}: AddNewButtonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      router.push(linkTo);
    }
  };

  return (
    <div className="h-full w-full">
      <Button
        onClick={handleClick}
        disabled={disabled}
        // variant="primary"
        size="icon"
        className={`h-${size} w-${size} shrink-0 rounded-full`}
      >
        <Plus className={`h-${size - 2} w-${size - 2}`} />
        <span className="sr-only">Add {title}</span>
      </Button>
    </div>
  );
}
