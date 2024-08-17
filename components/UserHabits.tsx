"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import HabitCard from "@components/HabitCard";
import { Accordion } from "@components/ui/accordion";
import SkeletonCard from "@components/skeletons/SkeletonCard";

// try and use import { Session } from "next-auth"; type here
interface User {
  id: string;
  name?: string;
  email?: string;
}

interface Session {
  user: User;
}

type Habit = {
  _id: string;
  name: string;
  icon: string;
  description: string;
  xp: number;
  creator: {
    _id: string;
  };
};

type HabitListProps = {
  habits: Habit[];
  handleEdit: (habit: Habit) => void;
  handleDelete: (habit: Habit) => Promise<void>;
};

const HabitList = ({ habits, handleEdit, handleDelete }: HabitListProps) => {
  return (
    <Accordion type="single" className="w-full">
      {habits.map((habit: Habit) => (
        <HabitCard
          key={habit._id}
          habit={habit}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      ))}
    </Accordion>
  );
};

const skeletonCards = Array.from({ length: 3 }, (_, index) => (
  <SkeletonCard key={index} />
));

const Habits = () => {
  const router = useRouter();
  const { data: session } = useSession() as { data: Session | null };
  const [habits, setHabits] = useState([]);
  const [habitsLoaded, setHabitsLoaded] = useState(false);

  useEffect(() => {
    const fetchHabits = async () => {
      setHabitsLoaded(false);
      try {
        const response = await fetch(`/api/users/${session?.user.id}/habits`);
        const data = await response.json();
        setHabits(data.reverse());
      } catch (error) {
        console.error("Failed to fetch habits", error);
      } finally {
        setHabitsLoaded(true);
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
      {!habitsLoaded && <>{skeletonCards}</>}
      {habitsLoaded && (
        <HabitList
          habits={habits}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Habits;
