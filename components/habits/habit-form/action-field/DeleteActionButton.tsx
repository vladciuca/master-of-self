"use client";
import { CircleX, Archive } from "lucide-react";
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
import { useSideContentPosition } from "@hooks/useSideContentPosition";

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
  const { alertDialogStyle } = useSideContentPosition();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 text-red-500 hover:text-red-500"
        >
          {/* <CircleX size={20} /> */}
          <Archive size={20} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        className="max-w-sm w-[90%] rounded-md space-y-10"
        style={alertDialogStyle}
      >
        <AlertDialogHeader className="sm:flex sm:flex-col sm:space-y-2 sm:text-center">
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="sm:px-8">
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
        <AlertDialogFooter className="sm:flex sm:flex-col-reverse sm:space-x-0 sm:px-6">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} className="mb-4 sm:mb-6">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
