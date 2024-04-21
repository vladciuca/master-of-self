"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import HabitCard from "./HabitCard";
import SkeletonCard from "./SkeletonCard";
import NewHabit from "@components/NewHabit";

const HabitList = ({ habits, handleEdit, handleDelete }) => {
  return (
    <div className="w-full">
      {habits.map((habit) => (
        <HabitCard
          key={habit._id}
          habit={habit}
          handleEdit={() => handleEdit && handleEdit(habit)}
          handleDelete={() => handleDelete && handleDelete(habit)}
        />
      ))}
    </div>
  );
};

const Habits = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [habits, setHabits] = useState([]);
  const [habitsLoaded, setHabitsLoaded] = useState(false);

  useEffect(() => {
    const fetchHabits = async () => {
      setHabitsLoaded(false); // Start with skeleton cards
      try {
        const response = await fetch(`/api/users/${session?.user.id}/habits`);
        const data = await response.json();
        setHabits(data);
      } catch (error) {
        console.error("Failed to fetch habits", error);
      } finally {
        setHabitsLoaded(true); // After data is loaded, show the actual cards
      }
    };

    if (session?.user.id) {
      fetchHabits();
    }
  }, [session]);

  const handleEdit = (habit) => {
    router.push(`/update-habit?id=${habit._id}`);
  };

  const handleDelete = async (habit) => {
    const hasConfirmed = confirm("Are you sure you want to delete this habit?");

    if (hasConfirmed) {
      try {
        await fetch(`/api/habit/${habit._id.toString()}`, { method: "DELETE" });

        const filteredHabits = habits.filter(
          (myHabit) => myHabit._id !== habit._id
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
      <NewHabit />
      {!habitsLoaded &&
        [...Array(4)].map((index) => <SkeletonCard key={index} />)}

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
