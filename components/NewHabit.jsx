import Link from "next/link";
import {
  Card,
  // CardContent,
  // CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { LuTarget } from "react-icons/lu";

const NewHabit = () => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex">
          <LuTarget className="mr-2" />
          New habit
        </CardTitle>
        {/* <CardDescription>Card Description</CardDescription> */}
      </CardHeader>
      {/* <CardContent>
          <p>Card Content</p>
        </CardContent> */}
      <CardFooter>
        <Link href="/create-habit">
          <Button size="sm">Create</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default NewHabit;
