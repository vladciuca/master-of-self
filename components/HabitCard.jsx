"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "./ui/badge";
import { LuTarget } from "react-icons/lu";

const HabitCard = ({ habit, handleEdit, handleDelete }) => {
  const { name, description, categories } = habit;
  const { data: session } = useSession();
  const pathName = usePathname();
  // const router = useRouter();

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex">
          <LuTarget className="mr-2" />
          {name}
        </CardTitle>
        <CardDescription>
          {categories?.map((cat) => {
            if (cat === "mind")
              return (
                <Badge className="bg-pink-400 text-foreground mr-2">
                  {cat}
                </Badge>
              );
            if (cat === "body")
              return (
                <Badge className="bg-yellow-400 text-foreground mr-2">
                  {cat}
                </Badge>
              );
            if (cat === "spirit")
              return (
                <Badge className="bg-red-400 text-foreground mr-2">{cat}</Badge>
              );
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
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
      </CardFooter>
    </Card>
  );
};

export default HabitCard;
