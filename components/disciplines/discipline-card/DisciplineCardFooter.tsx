"use client";

import React from "react";
import { Button } from "@components/ui/button";
import { User, JournalCustomStepConfig } from "@models/types";
import type { Discipline } from "@models/mongodb";

import { DisciplineCreator } from "./DisciplineCreator";

type Step = JournalCustomStepConfig | Discipline;

type DisciplineCardFooterProps = {
  user: User | null;
  discipline: Step;
  pathName: string;
  handleEdit: (discipline: Discipline) => void;
};

function isUserDiscipline(step: Step): step is Discipline {
  return "creatorId" in step;
}

export function DisciplineCardFooter({
  user,
  discipline,
  pathName,
  handleEdit,
}: DisciplineCardFooterProps) {
  if (!isUserDiscipline(discipline)) return null;
  //NOTE: so the buttons do not appear on other peoples habit cards
  // Only show for creator
  if (user?.id !== discipline.creatorId.toString()) {
    return (
      <div className="mt-4 flex items-center justify-end">
        <DisciplineCreator creatorId={discipline.creatorId.toString()} />
      </div>
    );
  }

  return (
    <div className="mt-4 px-2">
      <div className="flex space-x-4">
        <Button
          variant="outline"
          onClick={() => handleEdit(discipline)}
          className="flex-1 w-full"
        >
          Update Discipline
        </Button>
      </div>
    </div>
  );
}
