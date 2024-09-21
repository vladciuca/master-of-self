import { UserHabits } from "@components/habits/UserHabits";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@lib/authOptions";
// import { fetchHabits } from "@lib/api";
// import { Session } from "@app/types/types";

// export default async function Habits() {
//   let session: Session | null = null;
//   let habits = [];
//   let error = null;

//   try {
//     session = await getServerSession(authOptions);

//     if (!session) {
//       return {
//         redirect: {
//           destination: "/",
//           permanent: false,
//         },
//       };
//     }

//     if (!session.user?.id) {
//       throw new Error("User ID not found in session");
//     }

//     habits = await fetchHabits(session.user.id);
//   } catch (err) {
//     console.error("Error in Habits page:", err);
//     error = "An error occurred. Please try again later.";
//   }

//   return (
//     <div>
//       <h1>Habits Page - SERVER RENDER</h1>
//       {error ? (
//         <p>{error}</p>
//       ) : habits.length > 0 ? (
//         <UserHabits habits={habits} />
//       ) : (
//         <p>No habits found.</p>
//       )}
//     </div>
//   );
// }

export default function Habits() {
  return <UserHabits />;
}
