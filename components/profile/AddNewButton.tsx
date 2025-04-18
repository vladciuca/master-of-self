"use client";

import { useRouter } from "next/navigation";
import { Button } from "@components/ui/button";
import { Plus } from "lucide-react";

type AddNewButtonProps = {
  title: string;
  linkTo: string;
  disabled?: boolean;
};

export function AddNewButton({
  title,
  linkTo,
  disabled = false,
}: AddNewButtonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      router.push(linkTo);
    }
  };

  return (
    <div>
      <Button
        onClick={handleClick}
        disabled={disabled}
        // variant="primary"
        size="icon"
        className="h-6 w-6 shrink-0 rounded-full"
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">Add {title}</span>
      </Button>
    </div>
  );
}
