"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import data from "@emoji-mart/data";
import { init } from "emoji-mart";
import SkillLevel from "@components/SkillLevel";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";
import { Button } from "@components/ui/button";
import { FaHandFist, FaBrain, FaHeart } from "react-icons/fa6";

init({ data });

const SkillCard = ({ habit, handleEdit, handleDelete }) => {
  const {
    _id = "",
    name = "",
    icon = "",
    description = "",
    categories = [],
    resource = 0,
  } = habit;

  const { data: session } = useSession();
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
          <SkillLevel xp={resource} />
          <div className="flex items-center justify-start mt-4">
            {categories?.map((cat) => {
              return (
                <div
                  key={cat}
                  className="h-7 w-7 bg-primary rounded-full flex items-center justify-center"
                >
                  {cat === "mind" && (
                    <FaBrain
                      className="text-primary-foreground"
                      size={"1.3rem"}
                    />
                  )}
                  {cat === "body" && (
                    <FaHandFist
                      className="text-primary-foreground"
                      size={"1.3rem"}
                    />
                  )}
                  {cat === "spirit" && (
                    <FaHeart
                      className="text-primary-foreground"
                      size={"1.3rem"}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="my-1">
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="mt-12">
          {session?.user.id === habit.creator._id && pathName === "/habits" && (
            <div>
              <Button onClick={handleEdit} className="mr-3" size="sm">
                Edit
              </Button>
              <Button variant="ghost" onClick={handleDelete} size="sm">
                Delete
              </Button>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default SkillCard;
