"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SkillCard from "./SkillCard";
import NewHabit from "@/components/NewSkill";
import { Accordion } from "@/components/ui/accordion";

const SkillList = ({ habits, handleEdit, handleDelete }) => {
  return (
    <Accordion className="w-full">
      {habits.map((habit) => (
        <SkillCard
          key={habit._id}
          habit={habit}
          handleEdit={() => handleEdit && handleEdit(habit)}
          handleDelete={() => handleDelete && handleDelete(habit)}
        />
      ))}
    </Accordion>
  );
};

const Habits = () => {
  const router = useRouter();
  const { data: session } = useSession();
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
      {!habitsLoaded && (
        <div className="w-full h-full flex justify-center items-center">
          <div className="loader" />
        </div>
      )}

      {habitsLoaded && (
        <SkillList
          habits={habits}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Habits;
