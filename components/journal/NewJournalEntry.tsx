import { useRouter } from "next/navigation";
import { JournalEntryActionButton } from "./JournalEntryActionButton";
import { Card } from "@components/ui/card";
import { FaBoltLightning } from "react-icons/fa6";
import { JOURNAL_COLORS } from "@lib/colors";
import { useYesterdayJournalEntry } from "@hooks/journal/useYesterdayJournalEntry";
import { useTodayJournalEntry } from "@hooks/journal/useTodayJournalEntry";
import { useCreateJournalEntry } from "@hooks/journal/useCreateJournalEntry";

type NewJournalEntryProps = {
  isEveningTime: boolean;
};

export function NewJournalEntry({ isEveningTime }: NewJournalEntryProps) {
  const router = useRouter();
  // NOTE: No error handling!!!!
  const { bonusWillpower = 0, yesterdayEntryLoading } =
    useYesterdayJournalEntry();
  const { todayEntry, todayEntryLoading } = useTodayJournalEntry();
  const {
    createJournalEntry,
    submittingJournalEntry,
    createJournalEntryError,
  } = useCreateJournalEntry();

  const date = new Date();
  const day = date.getDate();
  const dayOfWeek = date
    .toLocaleString("default", { weekday: "short" })
    .toUpperCase();

  const handleCreateJournalEntry = async () => {
    try {
      // NOTE: the createJournalEntry function returns NEW ENTRY ID after submit
      const newEntryId = await createJournalEntry();

      router.push(`/update-journal-entry/${newEntryId}`);
    } catch (error) {
      console.error(
        "Failed to create new journal entry:",
        createJournalEntryError
      );
    }
  };

  // Check of entry for today exists by converting it to a boolean
  const hasTodayEntry = !!todayEntry;

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
                {(bonusWillpower ?? 0) > 0 ? (
                  <span className={`text-${JOURNAL_COLORS.night} font-bold`}>
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
            {/* <div className="flex justify-end">
              <div className="text-xs mt-1 text-muted-foreground">
                {"Willpower"}
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* <div className="w-full text-muted-foreground mt-4">
        <div className="flex items-center flex-col">
          <div className="flex items-center text-sm">
            {!isEveningTime
              ? "Journal today to generate willpower and stay motivated through the day!"
              : "Reflect on today and start tomorrow with more motivation and willpower!"}
          </div>
        </div>
      </div> */}

      <div className="w-full flex mt-4">
        <JournalEntryActionButton
          text={
            submittingJournalEntry
              ? "Creating..."
              : hasTodayEntry
              ? "Entry for today already exists!"
              : "Let’s go!"
          }
          handleClick={handleCreateJournalEntry}
          handleDisabled={
            submittingJournalEntry || todayEntryLoading || hasTodayEntry
          }
          isSubmitting={submittingJournalEntry}
        />
      </div>
    </Card>
  );
}
