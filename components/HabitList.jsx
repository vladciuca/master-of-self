"use client";

import { useState, useEffect } from "react";
import HabitCard from "./HabitCard";
import NewHabit from "@components/NewHabit";

const HabitCardList = ({ habits }) => {
  return (
    <div className="w-1/2">
      {habits.map((habit) => (
        <HabitCard key={habit._id} habit={habit} />
      ))}
      <NewHabit />
    </div>
  );
};

const Habits = () => {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    const fetchHabits = async () => {
      const response = await fetch("/api/habit");
      const data = await response.json();

      setHabits(data);
    };

    fetchHabits();
  }, []);

  return <HabitCardList habits={habits} />;
};

export default Habits;
