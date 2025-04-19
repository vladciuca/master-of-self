import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useUserProfile } from "@context/UserProfileContext";
// import { useToast } from "@/components/ui/use-toast";

export function DisciplineFeedFooter({ stepId }: { stepId: string }) {
  const { updateDisciplinesValues, userProfile } = useUserProfile();
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
      // Create an update object with the new discipline ID and value 0
      const disciplineUpdate = { [stepId]: 0 };
      const result = await updateDisciplinesValues(disciplineUpdate);

      if (result?.success) {
        // toast({
        //   title: "Discipline added",
        //   description: "The discipline has been added to your profile",
        // });
      } else {
        // toast({
        //   title: "Error",
        //   description: result?.error || "Failed to add discipline",
        //   variant: "destructive",
        // });
      }
    } catch (error) {
      console.error("Error adding discipline:", error);
      // toast({
      //   title: "Error",
      //   description: "Failed to add discipline",
      //   variant: "destructive",
      // });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex justify-end p-2">
      <Button
        onClick={handleAddDiscipline}
        disabled={isDisciplineAdded || isAdding}
        variant={isDisciplineAdded ? "secondary" : "default"}
        size="sm"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        {isDisciplineAdded
          ? "Added"
          : isAdding
          ? "Adding..."
          : "Add Discipline"}
      </Button>
    </div>
  );
}
