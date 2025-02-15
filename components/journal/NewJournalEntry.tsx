import { useRouter } from "next/navigation";
import { Card } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { FaBoltLightning } from "react-icons/fa6";
import { journalColors } from "@components/ui/constants";
import { useYesterdayJournalEntry } from "@hooks/useYesterdayJournalEntry";
import { useTodayJournalEntry } from "@hooks/useTodayJournalEntry";
import { useCreateJournalEntry } from "@hooks/useCreateJournalEntry";

type NewJournalEntryProps = {
  isEveningTime: boolean;
};

export function NewJournalEntry({ isEveningTime }: NewJournalEntryProps) {
  const router = useRouter();
  const { yesterdayEntryLoading, bonusWillpower = 0 } =
    useYesterdayJournalEntry();
  const { todayEntry, todayEntryLoading } = useTodayJournalEntry();
  const { createJournalEntry, submitting } = useCreateJournalEntry();

  const date = new Date();
  const day = date.getDate();
  const dayOfWeek = date
    .toLocaleString("default", { weekday: "short" })
    .toUpperCase();

  const handleCreateJournalEntry = async () => {
    try {
      const newEntryId = await createJournalEntry();

      router.push(`/update-journal-entry/${newEntryId}`);
    } catch (error) {
      console.error("Failed to create new journal entry:", error);
    }
  };

  const isEntryExisting = !!todayEntry;

  return (
    <Card className="p-4 mb-4">
      <div className="w-full">
        <div className="flex w-full justify-between">
          <div className="flex items-center">
            <div className="bg-muted text-foreground h-16 w-16 rounded-sm flex flex-col justify-center items-center">
              <div className="uppercase text-md font-semibold">{dayOfWeek}</div>
              <div className="text-3xl font-semibold">{day}</div>
            </div>
          </div>
          <div className="ml-6">
            <div className="flex items-center">
              <div className="w-full flex items-center justify-center text-3xl">
                {bonusWillpower > 0 ? (
                  <span className={`text-${journalColors.night} font-bold`}>
                    +{bonusWillpower}
                  </span>
                ) : (
                  <span className="font-semibold">
                    {yesterdayEntryLoading ? "??" : 0}
                  </span>
                )}
                <FaBoltLightning className="ml-1 text-2xl" />
              </div>
            </div>
            <div className="flex justify-end">
              <div className="text-xs mt-1 text-muted-foreground">
                {"Willpower"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full text-muted-foreground mt-4">
        <div className="flex items-center flex-col">
          <div className="flex items-center">
            {!isEveningTime
              ? "Journal today to generate willpower and stay motivated through the day!"
              : "Reflect on today's highlights and start tomorrow with more motivation and willpower!"}
          </div>
        </div>
      </div>

      <div className="w-full flex mt-4">
        <Button
          size="sm"
          className="py-3"
          onClick={handleCreateJournalEntry}
          disabled={submitting || isEntryExisting || todayEntryLoading}
        >
          {submitting
            ? "Creating..."
            : isEntryExisting
            ? "Entry already exists"
            : "Start today's journal"}
        </Button>
      </div>
    </Card>
  );
}
