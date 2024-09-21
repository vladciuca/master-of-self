import { getServerSession } from "next-auth/next";
import { UserHabits } from "@components/habits/UserHabits";
import { authOptions } from "@lib/authOptions";
import { fetchHabits } from "@lib/api";
import { Session } from "@app/types/types";

export default async function Habits() {
  const session: Session | null = await getServerSession(authOptions);
  let habits = [];
  let error = null;

  if (!session) {
    error = "No session found. Please log in to view your habits.";
  } else if (!session.user) {
    error = "No user found in session. Please log in again.";
  } else if (!session.user.id) {
    error = "User ID not found. Please log in again.";
  } else {
    try {
      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

      habits = await fetchHabits(session.user.id);
      console.log("Fetched habits:", habits);
    } catch (error) {
      console.error("Failed to fetch habits:", error);
      error = "Failed to load habits. Please try again later.";
    }
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
    <div>
      <h1>Habits Page</h1>
      {habits.length > 0 ? (
        <UserHabits habits={habits} />
      ) : (
        <p>No habits found.</p>
      )}
    </div>
  );
}
