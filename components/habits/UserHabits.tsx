"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@components/PageHeader";
import { HabitList } from "@components/habits/HabitList";
import { SkeletonHabitCard } from "@components/skeletons/SkeletonHabitCard";
import { Shell } from "lucide-react";
import { useUserHabits } from "@hooks/useUserHabits";
import { Habit } from "@app/types/types";

const NEW_HABIT_CARD_DETAILS = {
  symbol: <Shell size={"2rem"} />,
  title: "Habits",
  description: (
    <>
      These represent <span className="text-foreground">actions</span> that you
      can take daily to progress on your goals.
    </>
  ),
  buttonText: "Create New Habit",
  linkTo: "/create-habit",
};

const skeletonCards = Array.from({ length: 3 }, (_, index) => (
  <SkeletonHabitCard key={index} />
));

export function UserHabits() {
  const { habits, habitsLoading, habitsError } = useUserHabits();
  const router = useRouter();

  const numberOfEntries = habitsLoading ? "?" : habits.length;

  const handleEdit = (habit: Habit) => {
    router.push(`/update-habit/${habit._id}`);
  };

  // const handleDelete = async (habit: Habit) => {
  //   const hasConfirmed = confirm("Are you sure you want to delete this habit?");

  //   if (hasConfirmed) {
  //     try {
  //       await fetch(`/api/habit/${habit._id.toString()}`, { method: "DELETE" });

  //       router.push("/habits");
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };

  return (
    <div className="w-full">
      <PageHeader
        symbol={NEW_HABIT_CARD_DETAILS.symbol}
        title={NEW_HABIT_CARD_DETAILS.title}
        // description={NEW_HABIT_CARD_DETAILS.description}
        // buttonText={NEW_HABIT_CARD_DETAILS.buttonText}
        linkTo={NEW_HABIT_CARD_DETAILS.linkTo}
        numberOfEntries={numberOfEntries}
      />

      {habitsLoading && skeletonCards}
      {!habitsLoading && !habitsError && (
        <HabitList
          habits={habits}
          handleEdit={handleEdit}
          // handleDelete={handleDelete}
        />
      )}
      {habitsError && <p>Error: {habitsError}</p>}
    </div>
  );
}
