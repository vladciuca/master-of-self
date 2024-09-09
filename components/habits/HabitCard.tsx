"use client";

import data from "@emoji-mart/data";
import { init } from "emoji-mart";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { calculateLevel, xpForLevel } from "@components/LevelBar";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";
import { Button } from "@components/ui/button";
import { FaBoltLightning } from "react-icons/fa6";
import { Session, Habit } from "@/app/types/types";
import { Progress } from "@components/ui/progress";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "em-emoji": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        shortcodes: string;
        size: string;
      };
    }
  }
}

init({ data });

type HabitCardProps = {
  habit: Habit;
  handleEdit: (habit: Habit) => void;
  handleDelete: (habit: Habit) => Promise<void>;
};

const HabitCard = ({ habit, handleEdit, handleDelete }: HabitCardProps) => {
  const { _id = "", name = "", icon = "", description = "", xp = 0 } = habit;
  const { data: session } = useSession() as { data: Session | null };
  const pathName = usePathname();

  const level = calculateLevel(xp);
  const { baseXP, nextLevelXP } = xpForLevel(level);
  const progressPercentage = ((xp - baseXP) / (nextLevelXP - baseXP)) * 100;
  const currentXpForCurrentLevel = xp - baseXP;
  const xpToLevelUp = nextLevelXP - baseXP;

  return (
    <AccordionItem value={_id} className="my-4 p-0">
      <AccordionTrigger className="p-0 pb-2 m-0 rounded-md flex flex-col">
        <div className="w-full flex justify-between p-2">
          <div className="flex">
            <div className="ml-3 mr-5 rounded-full">
              <em-emoji shortcodes={icon} size="2.2rem" />
            </div>
            <div className="text-start">
              <h4 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                {name}
              </h4>
              <div className="text-muted-foreground text-sm">
                Level
                <span className="ml-2 text-md text-foreground font-semibold">
                  {level}
                </span>
              </div>
            </div>
          </div>
          <div className="text-sm flex items-end text-muted-foreground">
            {currentXpForCurrentLevel} / {xpToLevelUp}
            <div className="mb-1 ml-1">
              <FaBoltLightning />
            </div>
          </div>
        </div>
        <div className="w-full px-2">
          <Progress value={progressPercentage} className="h-2" />
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
};

export default HabitCard;
