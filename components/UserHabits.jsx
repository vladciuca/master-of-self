"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import HabitCard from "./HabitCard";
import NewHabit from "@components/NewHabit";

const HabitList = ({ habits, handleEdit, handleDelete }) => {
  return (
    <div className="w-full">
      <NewHabit />
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

  useEffect(() => {
    const fetchHabits = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/habits`);
      const data = await response.json();
      setHabits(data);
    };

    if (session?.user.id) fetchHabits();
  }, []);

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
    <HabitList
      habits={habits}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default Habits;
