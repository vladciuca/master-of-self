import { getServerSession } from "next-auth/next";
import { UserHabits } from "@components/habits/UserHabits";
import { authOptions } from "@lib/authOptions";
import { fetchHabits } from "@lib/api";
import { Session } from "@app/types/types";

export default async function Habits() {
  const session: Session | null = await getServerSession(authOptions);
  let habits = [];
  let error = null;

  if (session?.user.id) {
    try {
      habits = await fetchHabits(session.user.id);
    } catch (e) {
      console.error("Failed to fetch habits:", e);
      error = "Failed to load habits. Please try again later.";
    }
  } else {
    error = "Please log in to view your habits.";
  }

  return <div>{error ? <p>{error}</p> : <UserHabits habits={habits} />}</div>;
}
