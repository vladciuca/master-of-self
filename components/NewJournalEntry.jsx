import Link from "next/link";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import { FaSun } from "react-icons/fa";

const NewJournalEntry = () => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex tracking-wide">
          <FaSun className="mr-2" />
          New Journal Entry
        </CardTitle>
      </CardHeader>
      <CardFooter>
        <Link href="/create-journal-entry">
          <Button size="sm">Create</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default NewJournalEntry;
