"use client";
import { CircleX } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
// import { useSideContentPosition } from "@hooks/useSideContentPosition";

interface DeleteActionButtonProps {
  onDelete: () => void;
  actionName: string;
  actionPrefix: string;
  actionIcon: JSX.Element;
}

export function DeleteActionButton({
  onDelete,
  actionName,
  actionPrefix,
  actionIcon,
}: DeleteActionButtonProps) {
  //   const { drawerStyle } = useSideContentPosition();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 text-red-500 hover:text-red-500"
        >
          <CircleX size={20} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
      //   style={drawerStyle}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the action
            <span className="ml-2 inline-flex items-center align-middle">
              {actionIcon}
            </span>
            <span className="text-primary font-semibold align-middle">
              {actionPrefix} {actionName}
            </span>
            . This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
