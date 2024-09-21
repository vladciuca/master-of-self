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
      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

      habits = await fetchHabits(session.user.id);
      console.log("Fetched habits:", habits);
    } catch (error) {
      console.error("Failed to fetch habits:", error);
      error = "Failed to load habits. Please try again later.";
    }
  } else {
    error = "Please log in to view your habits.";
  }

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  // return <UserHabits habits={habits} />;
  return (
    <>
      {habits.map((habit: any) => (
        <div key={habit.id}>habit.name</div>
      ))}
    </>
  );
}
