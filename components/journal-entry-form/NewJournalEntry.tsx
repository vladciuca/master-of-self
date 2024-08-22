"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@components/ui/card";
import { Button } from "@components/ui/button";
import { FaSun } from "react-icons/fa";

interface Session {
  user?: {
    id?: string | null;
  };
}

const NewJournalEntry = () => {
  const router = useRouter();
  const { data: session } = useSession() as { data: Session | null };
  const [submitting, setSubmitting] = useState<boolean>(false);

  const createJournalEntry = async () => {
    setSubmitting(true);

    try {
      const createNewEntryResponse = await fetch("/api/journal-entry/new", {
        method: "POST",
        body: JSON.stringify({
          userId: session?.user?.id,
          dailyWillpower: 0,
        }),
      });

      if (createNewEntryResponse.ok) {
        const todayEntryResponse = await fetch(
          `/api/users/${session?.user?.id}/journal-entries/today`
        );

        const todayEntry = await todayEntryResponse.json();

        if (todayEntry?._id) {
          router.push(`/update-journal-entry/${todayEntry._id}`);
        } else {
          console.error("Failed to find today's entry after creation");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex">
          <FaSun className="mr-2" />
          {"Day Entry"}
        </CardTitle>
        <CardDescription className="mt-1 mr-4">
          {"Generate willpower to rise and today's challenges."}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button
          size="sm"
          className="py-3"
          onClick={createJournalEntry}
          disabled={submitting}
        >
          {submitting ? "Creating..." : "Start today's journal"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewJournalEntry;
