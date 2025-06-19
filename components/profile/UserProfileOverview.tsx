"use client";

import { useRouter } from "next/navigation";
import { ProfileInfo } from "@components/profile/profile-info/ProfileInfo";
import { ProfileDisciplines } from "@components/profile/profile-disciplines/ProfileDisciplines";
import { useUserData } from "@/hooks/user/useUserData";
import { useUserHabits } from "@hooks/habits/useUserHabits";
import { HabitIconProgressBar } from "@components/habits/HabitIconProgressBar";
import { Button } from "@components/ui/button";
import { ScrollArea } from "@components/ui/scroll-area";
import { WeeklyWillpowerChart } from "@components/profile/weekly-willpower-chart/WeeklyWillpowerChart";
import { RxChevronLeft } from "react-icons/rx";
import LoadingScreen from "@components/skeletons/LoadingScreen";
import { UserDetails } from "./UserDetails";

interface UserProfileOverviewProps {
  userId?: string;
  notCurrentUser?: boolean;
}

export function UserProfileOverview({
  userId,
  notCurrentUser = true,
}: UserProfileOverviewProps) {
  const router = useRouter();

  const { user, loading, error } = useUserData(String(userId));
  const { habits, habitsLoading, habitsError } = useUserHabits(userId);

  // Handle loading state
  if (loading) {
    return <LoadingScreen />;
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-red-500 font-semibold text-xl">Error: {error}</div>
        {/* {notCurrentUser && ( */}
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Go Back
        </button>
        {/* )} */}
      </div>
    );
  }

  // Handle case where user is not found
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-xl">User not found</div>
        {/* {notCurrentUser && ( */}
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Go Back
        </button>
        {/* )} */}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-full justify-between ${
        !notCurrentUser ? "px-0" : "px-4 pt-6"
      }`}
    >
      <div className="space-y-6 mb-2">
        {!notCurrentUser ? (
          <UserDetails />
        ) : (
          <ProfileInfo
            name={user.name || ""}
            email={user.email || ""}
            image={user.image || ""}
            userId={userId || ""}
          />
        )}
      </div>

      <div className="mb-4 sm:mb-8">
        <WeeklyWillpowerChart displaySmall userId={userId} />
      </div>

      {habits.length > 0 && !habitsLoading && !habitsError && (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 w-full max-w-full h-28 mb-3 sm:mb-6">
          {habits.map((habit) => (
            <div key={habit._id} className="min-w-20">
              <HabitIconProgressBar
                icon={habit.icon}
                xp={habit.xp}
                displaySmall
                name={habit.name}
              />
            </div>
          ))}
        </div>
      )}

      <ScrollArea className="pr-1 flex-1">
        <ProfileDisciplines disciplines={user.profile.disciplines || {}} />
      </ScrollArea>

      {notCurrentUser && (
        <div className="flex flex-col justify-center items-center mt-2 h-[10vh] px-1">
          <Button
            variant="secondary"
            className="w-full mt-3 mb-4"
            onClick={() => router.back()}
          >
            <RxChevronLeft />
            Back
          </Button>
        </div>
      )}
    </div>
  );
}
