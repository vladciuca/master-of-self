import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, CheckCircle } from "lucide-react";
import { useUserProfile } from "@context/UserProfileContext";
// import { useToast } from "@/components/ui/use-toast";

export function PracticeFeedFooter({ stepId }: { stepId: string }) {
  const { updateActivePractice, updatePracticesValues, userProfile } =
    useUserProfile();
  // const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const isPracticeAdded =
    userProfile.practices && stepId in userProfile.practices;

  const handleAddPractice = async () => {
    if (isPracticeAdded) return;

    setIsAdding(true);
    try {
      const practiceUpdate = { [stepId]: 0 };
      const addResult = await updatePracticesValues(practiceUpdate);

      if (addResult?.success) {
        // Then activate it
        await updateActivePractice(stepId, true);
        // Success toast
      } else {
        // Error toast
      }
    } catch (error) {
      console.error("Error adding practice:", error);
      // Error toast
    } finally {
      setIsAdding(false);
    }
  };
  return (
    <>
      <div className="flex p-2 mt-2 w-full">
        {!isPracticeAdded && (
          <>
            <Button
              onClick={handleAddPractice}
              disabled={isPracticeAdded || isAdding}
              variant={isPracticeAdded ? "outline" : "default"}
              className="cursor-pointer w-full"
            >
              {isPracticeAdded ? (
                <CheckCircle className="mr-2 w-4 h-4" />
              ) : (
                <PlusCircle className="mr-2 w-4 h-4" />
              )}
              {isPracticeAdded
                ? "Already Added"
                : isAdding
                ? "Adding..."
                : "Add Practice"}
            </Button>
          </>
        )}
      </div>
    </>
  );
}
