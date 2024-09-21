// import { getServerSession } from "next-auth/next";
import { UserHabits } from "@components/habits/UserHabits";
// import { authOptions } from "@lib/authOptions";
// import { fetchHabits } from "@lib/api";
// import { Session } from "@app/types/types";

// export default async function Habits() {
//   const session: Session | null = await getServerSession(authOptions);
//   let habits = [];
//   let error = null;

//   if (!session) {
//     error = "No session found. Please log in to view your habits.";
//   } else if (!session.user) {
//     error = "No user found in session. Please log in again.";
//   } else if (!session.user.id) {
//     error = "User ID not found. Please log in again.";
//   } else {
//     try {
//       console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

//       habits = await fetchHabits(session.user.id);
//       console.log("Fetched habits:", habits);
//     } catch (error) {
//       console.error("Failed to fetch habits:", error);
//       error = "Failed to load habits. Please try again later.";
//     }
//   }

//   if (error) {
//     return (
//       <div>
//         <h1>Error</h1>
//         <p>{error}</p>
//       </div>
//     );
//   }

//   // return <UserHabits habits={habits} />;
//   return (
//     <div>
//       <h1>Habits Page</h1>
//       {habits.length > 0 ? (
//         <UserHabits habits={habits} />
//       ) : (
//         <p>No habits found.</p>
//       )}
//     </div>
//   );
// }

import { getServerSession } from "next-auth/next";
import { authOptions } from "@lib/authOptions";
import { fetchHabits } from "@lib/api";
import { Session } from "@app/types/types";

export default async function Habits() {
  let session: Session | null = null;
  let habits = [];
  let error = null;

  try {
    session = await getServerSession(authOptions);

    if (!session) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    if (!session.user?.id) {
      throw new Error("User ID not found in session");
    }

    habits = await fetchHabits(session.user.id);
  } catch (err) {
    console.error("Error in Habits page:", err);
    error = "An error occurred. Please try again later.";
  }

  return (
    <div>
      <h1>Habits Page</h1>
      {error ? (
        <p>{error}</p>
      ) : habits.length > 0 ? (
        <UserHabits habits={habits} />
      ) : (
        <p>No habits found.</p>
      )}
    </div>
  );
}
