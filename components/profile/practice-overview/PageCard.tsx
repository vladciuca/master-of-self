import { PracticeCard } from "@components/practices/PracticeCard";
import { PracticeSwitch } from "@components/practices/PracticeSwitch";
import { Button } from "@components/ui/button";
import { Trash2, GripVertical } from "lucide-react";
import type { PracticePageItem } from "@models/types";

function isOwnPage(page: PracticePageItem, userId?: string): boolean {
  if (!("creatorId" in page) || !page.creatorId || !userId) return false;
  return page.creatorId.toString() === userId;
}

export function PageCard({
  page,
  isActive,
  onToggle,
  onEdit,
  onDelete,
  userId,
  reorderMode = false,
  onMoveUp,
  onMoveDown,
  disableMoveUp = false,
  disableMoveDown = false,
}: {
  page: PracticePageItem;
  isActive: boolean;
  onToggle: (checked: boolean) => void;
  onEdit: (page: PracticePageItem) => void;
  onDelete: (page: PracticePageItem) => void;
  userId?: string;
  reorderMode?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  disableMoveUp?: boolean;
  disableMoveDown?: boolean;
}) {
  return (
    <PracticeCard
      step={page}
      disableAccordionToggle={reorderMode}
      onMoveUp={reorderMode ? onMoveUp : undefined}
      onMoveDown={reorderMode ? onMoveDown : undefined}
      disableMoveUp={disableMoveUp}
      disableMoveDown={disableMoveDown}
      action={
        reorderMode ? (
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        ) : (
          <PracticeSwitch
            type={page.type}
            checked={isActive}
            onCheckedChange={onToggle}
            disabled={false}
          />
        )
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
