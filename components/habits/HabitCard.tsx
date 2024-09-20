"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { IconRenderer } from "@components/IconRenderer";
import { CircularProgress } from "@components/ui/circular-progress";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";
import { Button } from "@components/ui/button";
import { calculateLevel, xpForLevel } from "@lib/level";
import { Session, Habit } from "@app/types/types";

type HabitCardProps = {
  habit: Habit;
  handleEdit: (habit: Habit) => void;
  handleDelete: (habit: Habit) => Promise<void>;
};

export function HabitCard({ habit, handleEdit, handleDelete }: HabitCardProps) {
  const { _id = "", name = "", icon = "", description = "", xp = 0 } = habit;
  const { data: session } = useSession() as { data: Session | null };
  const pathName = usePathname();

  const level = calculateLevel(xp);
  const { baseXP, nextLevelXP } = xpForLevel(level);
  const progressPercentage = ((xp - baseXP) / (nextLevelXP - baseXP)) * 100;
  const xpForCurrentLevel = xp - baseXP;
  const xpToLevelUp = nextLevelXP - baseXP;

  return (
    <AccordionItem value={_id} className="my-4 p-0">
      <AccordionTrigger className="p-0 m-0 rounded-md flex flex-col">
        <div className="p-2 px-4 flex justify-between text-start w-full">
          <div className="flex flex-grow">
            <div className="flex items-center">
              <IconRenderer iconName={icon} className="text-6xl" xp={xp} />
            </div>
            <div className="px-4 flex flex-col justify-center">
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                {name}
              </h4>
              <div className="text-sm text-muted-foreground">Level {level}</div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative flex items-center justify-center h-full w-full">
              <CircularProgress
                className="ml-4"
                value={progressPercentage}
                strokeWidth={6}
                circleSize={70}
              />
              <div
                className="absolute w-full flex flex-col"
                style={{
                  pointerEvents: "none", // Ensure text does not block interactions
                }}
              >
                <div
                  className="text-center text-xs"
                  style={{
                    pointerEvents: "none", // Ensure text does not block interactions
                  }}
                >
                  {xpForCurrentLevel} / {xpToLevelUp}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4">
        <div className="my-4">
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="mt-12">
          {session?.user?.id === habit.creator._id &&
            pathName === "/habits" && (
              <div>
                <Button
                  onClick={() => handleEdit(habit)}
                  className="mr-3"
                  size="sm"
                >
                  Update
                </Button>
                {/* <Button
                  variant="ghost"
                  onClick={() => handleDelete(habit)}
                  size="sm"
                >
                  Delete(TEST)
                </Button> */}
              </div>
            )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
