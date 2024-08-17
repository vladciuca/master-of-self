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

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  handleEdit,
  handleDelete,
}) => {
  const { _id = "", name = "", icon = "", description = "", xp = 0 } = habit;
  const { data: session } = useSession() as { data: Session | null };
  const pathName = usePathname();

  return (
    <AccordionItem value={_id}>
      <AccordionTrigger>
        <div className="w-full">
          <div className="flex items-center justify-start mb-2">
            <div className="mr-3">
              <em-emoji shortcodes={icon} size="2.2rem" />
            </div>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              {name}
            </h3>
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
                <Button onClick={() => handleEdit} className="mr-3" size="sm">
                  Edit
                </Button>
                <Button variant="ghost" onClick={() => handleDelete} size="sm">
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
