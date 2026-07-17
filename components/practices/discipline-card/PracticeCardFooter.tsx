"use client";

import React from "react";
import { Button } from "@components/ui/button";
import { User, JournalCustomStepConfig } from "@models/types";
import type { Practice } from "@models/mongodb";

import { PracticeCreator } from "./PracticeCreator";

type Step = JournalCustomStepConfig | Practice;

type PracticeCardFooterProps = {
  user: User | null;
  practice: Step;
  pathName: string;
  handleEdit: (practice: Practice) => void;
};

function isUserPractice(step: Step): step is Practice {
  return "creatorId" in step;
}

export function PracticeCardFooter({
  user,
  practice,
  pathName,
  handleEdit,
}: PracticeCardFooterProps) {
  if (!isUserPractice(practice)) return null;
  //NOTE: so the buttons do not appear on other peoples habit cards
  // Only show for creator
  if (user?.id !== practice.creatorId.toString()) {
    return (
      <div className="mt-4 flex items-center justify-end">
        <PracticeCreator creatorId={practice.creatorId.toString()} />
      </div>
    );
  }

  return (
    <div className="mt-4 px-2">
      <div className="flex space-x-4">
        <Button
          variant="outline"
          onClick={() => handleEdit(practice)}
          className="flex-1 w-full"
        >
          Update Practice
        </Button>
      </div>
    </div>
  );
}
