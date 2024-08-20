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
      const response = await fetch("/api/journal-entry/new", {
        method: "POST",
        body: JSON.stringify({
          userId: session?.user?.id,
          dailyWillpower: 0,
        }),
      });

      if (response.ok) {
        // for now need to refresh
        // to change to - Form Step Controller (update form)
        // nu ai cum "/update-journal-form-entry" pt ca aici creezi obiectu nu exista idu trebuie sa faci get si dupa sa iei idu
        // navigating to another page will solve the issue, but i still need to trigger a rerender after submitting
        //in order to refetch the list after submitting this we need JournalEntryContext
        // router.push("/journal");
        window.location.reload();
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
        <CardTitle className="flex">title</CardTitle>
        <CardDescription className="mt-1 mr-4">desc</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button size="sm" className="py-3" onClick={createJournalEntry}>
          Start today's journal
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewJournalEntry;
