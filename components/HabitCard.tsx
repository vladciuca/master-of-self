"use client";

import data from "@emoji-mart/data";
import { init } from "emoji-mart";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import LevelBar from "@components/LevelBar";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";
import { Button } from "@components/ui/button";
import { SubTitle } from "./ui/tipography";

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

interface User {
  id: string;
  name?: string;
  email?: string;
}

interface Session {
  user: User;
}

type Habit = {
  _id: string;
  name: string;
  icon: string;
  description: string;
  xp: number;
  creator: {
    _id: string;
  };
};

interface HabitCardProps {
  habit: Habit;
  handleEdit: (habit: Habit) => void;
  handleDelete: (habit: Habit) => Promise<void>;
}

const getLevelColor = (xp: number): string => {
  if (xp < 100) return "#FFFFFF"; // Common
  if (xp < 300) return "#1EFF00"; // Uncommon
  if (xp < 600) return "#0070DD"; // Rare
  if (xp < 1000) return "#A335EE"; // Epic
  if (xp < 1500) return "#FF8000"; // Legendary
  if (xp < 2000) return "#E6CC80"; // Artifact
  return "#00CCFF"; // Heirloom
};

const HabitCard = ({ habit, handleEdit, handleDelete }: HabitCardProps) => {
  const { _id = "", name = "", icon = "", description = "", xp = 0 } = habit;
  const { data: session } = useSession() as { data: Session | null };
  const pathName = usePathname();

  const borderColor = getLevelColor(xp);
  const neonGlowStyle = {
    boxShadow: `0 0 1px ${borderColor}, 0 0 5px ${borderColor}, 0 0 7px ${borderColor}, 0 0 12px ${borderColor}`,
    transition: "box-shadow 0.3s ease-in-out",
  };

  return (
    <AccordionItem value={_id} className="my-6">
      <AccordionTrigger>
        <div className="w-full">
          <div className="flex items-center justify-start mb-2">
            <div
              className="mr-3 px-2 rounded-full"
              style={{ borderColor: borderColor, ...neonGlowStyle }}
            >
              <em-emoji shortcodes={icon} size="2.2rem" />
            </div>
            <SubTitle text={`${name}`} />
          </div>
          <LevelBar xp={xp} />
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="my-1">
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
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleDelete(habit)}
                  size="sm"
                >
                  Drop
                </Button>
              </div>
            )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default HabitCard;
