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
        createJournalEntryError,
      );
    }
  };

  // Check of entry for today exists by converting it to a boolean
  const hasTodayEntry = !!todayEntry;

  const hasBonusWillpower = (bonusWillpower ?? 0) > 0;
  const bannerMessage = hasBonusWillpower
    ? isEveningTime
      ? "Bonus willpower is waiting! Finish your evening loop to claim it and earn more for tomorrow."
      : "Bonus willpower awaits! Start your morning loop to keep momentum throughout the day."
    : isEveningTime
      ? "Close out with your evening loop! Reflect, recharge, and earn bonus willpower for tomorrow."
      : "A new day awaits! Start your morning loop to generate willpower and make every moment count.";

  return (
    <Card className="p-3 mb-4 border-none bg-muted/30">
      <div className="w-full">
        <div className="flex w-full items-center justify-between gap-3">
          <div className="bg-muted text-foreground h-12 w-12 rounded-sm flex flex-col justify-center items-center flex-shrink-0">
            <div className="uppercase text-xs font-semibold">{dayOfWeek}</div>
            <div className="text-xl font-semibold leading-tight">{day}</div>
          </div>

          <div className="flex-1 text-xs text-muted-foreground">
            {bannerMessage}
          </div>

          <div className="flex items-center flex-shrink-0">
            <div className="flex items-center text-3xl">
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
        </div>
      </div>

      <div className="w-full flex mt-3">
        <JournalEntryActionButton
          text={
            submittingJournalEntry
              ? "Creating Entry..."
              : hasTodayEntry
                ? "Entry for today already exists"
                : "Start today's Entry"
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
