"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { NewEntry } from "@components/NewEntry";
import { HabitList } from "@components/habits/HabitList";
import { SkeletonHabitCard } from "@components/skeletons/SkeletonHabitCard";
import { Shell } from "lucide-react";
import { Session, Habit } from "@/app/types/types";

const NEW_HABIT_CARD_DETAILS = {
  symbol: <Shell className="mr-2" size={"2rem"} />,
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
  const [habits, setHabits] = useState([]);
  const [habitsLoading, setHabitsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession() as { data: Session | null };
  const numberOfEntries = habitsLoading ? "??" : habits.length;

  useEffect(() => {
    const fetchHabits = async () => {
      setHabitsLoading(true);
      try {
        const response = await fetch(`/api/users/${session?.user.id}/habits`);
        const data = await response.json();
        setHabits(data.reverse());
      } catch (error) {
        console.error("Failed to fetch habits", error);
      } finally {
        setHabitsLoading(false);
      }
    };

    if (session?.user.id) {
      fetchHabits();
    }
  }, [session]);

  // To take a second look for consistency (handleEdit function can be replaced by Link or DELETE button can be moved to the /update-habit page)
  const handleEdit = (habit: Habit) => {
    router.push(`/update-habit/${habit._id}`);
  };

  const handleDelete = async (habit: Habit) => {
    const hasConfirmed = confirm("Are you sure you want to delete this habit?");

    if (hasConfirmed) {
      try {
        await fetch(`/api/habit/${habit._id.toString()}`, { method: "DELETE" });

        const filteredHabits = habits.filter(
          (myHabit: Habit) => myHabit._id !== habit._id
        );

        setHabits(filteredHabits);

        router.push("/habits");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="w-full">
      <NewEntry
        symbol={NEW_HABIT_CARD_DETAILS.symbol}
        title={NEW_HABIT_CARD_DETAILS.title}
        description={NEW_HABIT_CARD_DETAILS.description}
        buttonText={NEW_HABIT_CARD_DETAILS.buttonText}
        linkTo={NEW_HABIT_CARD_DETAILS.linkTo}
        numberOfEntries={numberOfEntries}
      />
      {habitsLoading && <>{skeletonCards}</>}
      {!habitsLoading && (
        <HabitList
          habits={habits}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
}
