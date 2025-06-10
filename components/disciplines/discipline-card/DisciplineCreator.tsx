import { GiCharacter } from "react-icons/gi";
import { useUserData } from "@hooks/user/useUserData"; // Update the import path as needed
import Link from "next/link";
import { Skeleton } from "@components/ui/skeleton";

type DisciplineCreatorProps = {
  creatorId: string;
};

export function DisciplineCreator({ creatorId }: DisciplineCreatorProps) {
  const { user, loading, error } = useUserData(creatorId);

  // Get name from the profile
  const name = user?.name || "";
  const nameInitials = name
    ? name
        .split(" ")
        .map((word: string) => word[0])
        .join("")
    : "";

  if (loading) {
    return (
      <div className="flex items-center mx-2 text-xs">
        <Skeleton className="ml-1 mr-2 font-semibold w-12 h-3" />

        <div className="overflow-hidden avatar text-xl font-semibold bg-muted text-primary rounded-full h-6 w-6 flex justify-center items-center">
          <GiCharacter size={25} className="mt-2" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-end mx-2 text-xs text-red-500">
        Error loading creator
      </div>
    );
  }

  return (
    <Link href={`/community/user/${creatorId}`}>
      <div className="flex items-end mx-2 text-xs">
        <span className="text-muted-foreground">Created by</span>

        <span className="ml-1 mr-2 font-semibold">{name}</span>

        <div className="overflow-hidden avatar text-xl font-semibold bg-muted text-primary rounded-full h-6 w-6 flex justify-center items-center">
          {/* {nameInitials} */}
          <GiCharacter size={25} className="mt-2" />
        </div>
      </div>
    </Link>
  );
}
