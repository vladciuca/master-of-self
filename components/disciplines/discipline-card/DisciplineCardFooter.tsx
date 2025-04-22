"use client";

import React from "react";
import { Button } from "@components/ui/button";
import { Session, JournalCustomStepConfig } from "@models/types";
import type { Discipline } from "@models/mongodb";

import { DisciplineCreator } from "./DisciplineCreator";

type Step = JournalCustomStepConfig | Discipline;

type DisciplineCardFooterProps = {
  session: Session | null;
  discipline: Step;
  pathName: string;
  handleEdit: (discipline: Discipline) => void;
  //   disciplineLoading: boolean;
};

function isUserDiscipline(step: Step): step is Discipline {
  return "creatorId" in step;
}

export function DisciplineCardFooter({
  session,
  discipline,
  pathName,
  handleEdit,
}: //   disciplineLoading,
DisciplineCardFooterProps) {
  if (!isUserDiscipline(discipline)) return null;
  //NOTE: so the buttons do not appear on other peoples habit cards
  // Only show for creator
  if (session?.user?.id !== discipline.creatorId.toString()) {
    console.log(discipline.creatorId.toString());
    // return null;
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
