import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, CheckCircle } from "lucide-react";
import { useUserProfile } from "@context/UserProfileContext";
// import { useToast } from "@/components/ui/use-toast";

export function DisciplineFeedFooter({ stepId }: { stepId: string }) {
  const { updateActiveDiscipline, updateDisciplinesValues, userProfile } =
    useUserProfile();
  // const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  // Check if this discipline is already in the user's disciplines
  // const isDisciplineAdded = React.useMemo(() => {
  //   return userProfile.disciplines && stepId in userProfile.disciplines;
  // }, [userProfile.disciplines, stepId]);

  const isDisciplineAdded =
    userProfile.disciplines && stepId in userProfile.disciplines;

  const handleAddDiscipline = async () => {
    if (isDisciplineAdded) return;

    setIsAdding(true);
    try {
      // First add the discipline
      const disciplineUpdate = { [stepId]: 0 };
      const addResult = await updateDisciplinesValues(disciplineUpdate);

      if (addResult?.success) {
        // Then activate it
        await updateActiveDiscipline(stepId, true);
        // Success toast
      } else {
        // Error toast
      }
    } catch (error) {
      console.error("Error adding discipline:", error);
      // Error toast
    } finally {
      setIsAdding(false);
    }
  };
  return (
    <>
      <div className="flex p-2 mt-2 w-full">
        {!isDisciplineAdded && (
          <>
            <Button
              onClick={handleAddDiscipline}
              disabled={isDisciplineAdded || isAdding}
              variant={isDisciplineAdded ? "outline" : "default"}
              className="cursor-pointer w-full"
            >
              {isDisciplineAdded ? (
                <CheckCircle className="mr-2 w-4 h-4" />
              ) : (
                <PlusCircle className="mr-2 w-4 h-4" />
              )}
              {isDisciplineAdded
                ? "Already Added"
                : isAdding
                ? "Adding..."
                : "Add Discipline"}
            </Button>
          </>
        )}
      </div>
    </>
  );
}
