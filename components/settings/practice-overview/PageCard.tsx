import { PracticeCard } from "@components/practices/PracticeCard";
import { PracticeSwitch } from "@components/practices/PracticeSwitch";
import { Button } from "@components/ui/button";
import { Trash2 } from "lucide-react";
import { isOwnPage, type PageItem } from "./types";

export function PageCard({
  page,
  isActive,
  onToggle,
  onEdit,
  onDelete,
  userId,
}: {
  page: PageItem;
  isActive: boolean;
  onToggle: (checked: boolean) => void;
  onEdit: (page: PageItem) => void;
  onDelete: (page: PageItem) => void;
  userId?: string;
}) {
  return (
    <PracticeCard
      step={page}
      action={
        <PracticeSwitch
          type={page.type}
          checked={isActive}
          onCheckedChange={onToggle}
          disabled={false}
        />
      }
      footer={
        isOwnPage(page, userId) ? (
          <div className="px-2 mt-2 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onEdit(page)}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-shrink-0 text-destructive hover:text-destructive"
              onClick={() => onDelete(page)}
              aria-label="Delete practice"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ) : undefined
      }
    />
  );
}
