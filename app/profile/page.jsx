"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";

const MyProfile = () => {
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
          (myHabit) => myHabit._id !== habit.id
        );

        setHabits(filteredHabits);

        router.push("/habits");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Profile
      name="My"
      desc="Welcome to your personalized profile page"
      habits={habits}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
