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
import { FaSun, FaMoon } from "react-icons/fa";

interface Session {
  user?: {
    id?: string | null;
  };
}

const NEW_JOURNAL_ENTRY_CARD_DETAILS = {
  symbol: {
    day: <FaSun size="1.5rem" className="mr-2" />,
    night: <FaMoon size="1.5rem" className="mr-2" />,
  },
  title: {
    day: "Day Entry",
    night: "Night Entry",
  },
  description: {
    day: "Generate willpower to rise and today's challenges.",
    night: "spend willpower on habits to increase mission progress.",
  },
  buttonText: {
    day: "Start today's Journal",
    night: "Finish today's Journal",
  },
  linkTo: {
    day: "/create-journal-entry",
    night: "",
  },
};

const NewJournalEntry = () => {
  const router = useRouter();
  const { data: session } = useSession() as { data: Session | null };

  const createJournalEntry = async () => {
    try {
      const response = await fetch("/api/journal-entry/new", {
        method: "POST",
        body: JSON.stringify({
          userId: session?.user?.id,
          dailyWillpower: 0,
        }),
      });

      if (response.ok) {
        router.push(`/gameplay`);
      }
    } catch (error) {
      console.log(error);
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
        <Button size="sm" className="py-3" onClick={createJournalEntry}>
          {"Start today's journal"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewJournalEntry;
