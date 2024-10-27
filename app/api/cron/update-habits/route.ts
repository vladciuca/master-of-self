// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@lib/authOptions";
// import { updateHabitsXp, updateHabitsActions } from "@lib/mongo/habits";
// import { HabitUpdate, HabitActionUpdate } from "@app/types/mongodb";
// import { getYesterdaysJournalEntry } from "@lib/mongo/journal-entries";
// import { getToday, getYesterday } from "@lib/time";
// import { calculateHabitsXpSumsFromActions } from "@lib/level";
// import { Session, JournalEntry } from "@app/types/types";

// export async function GET(req: NextRequest) {
//   // Verify that this is a cron job request
//   // const authHeader = req.headers.get("authorization");
//   // if (authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
//   //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   // }

//   try {
//     // Get the server session
//     const session = (await getServerSession(authOptions)) as Session | null;

//     if (!session || !session.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const userId = session.user.id;
//     const today = getToday();
//     const yesterday = getYesterday();

//     // Get yesterday's journal entry
//     const { yesterdaysJournalEntry, error: journalError } =
//       (await getYesterdaysJournalEntry(
//         userId,
//         today.toISOString(),
//         yesterday.toISOString()
//       )) as { yesterdaysJournalEntry: JournalEntry | null; error: any };

//     if (journalError) {
//       console.error(
//         `Error fetching yesterday's journal entry for user ${userId}:`,
//         journalError
//       );
//       return NextResponse.json(
//         { error: "Failed to fetch journal entry" },
//         { status: 500 }
//       );
//     }

//     if (yesterdaysJournalEntry) {
//       if (
//         yesterdaysJournalEntry.nightEntry?.actions &&
//         Object.keys(yesterdaysJournalEntry.nightEntry?.actions).length > 0
//       ) {
//         const habitActionsValues: HabitActionUpdate =
//           yesterdaysJournalEntry.nightEntry.actions;

//         // GET HABIT XP VALUES FROM via Y_DAYS ENTRY DATA
//         const habitXpFromActions = calculateHabitsXpSumsFromActions(
//           habitActionsValues,
//           yesterdaysJournalEntry.dailyWillpower
//         );

//         // SET HABIT XP UPDATE VALUES TO ARR
//         const habitsXpUpdate: HabitUpdate[] =
//           Object.entries(habitXpFromActions);

//         // Update habit XP
//         const { error: xpError } = await updateHabitsXp(habitsXpUpdate);
//         // Update habit ACTIONS
//         const { error: actionError } = await updateHabitsActions(
//           habitActionsValues
//         );

//         if (xpError) {
//           console.error(`Error updating XP for user ${userId}:`, xpError);
//         }

//         if (actionError) {
//           console.error(
//             `Error updating actions for user ${userId}:`,
//             actionError
//           );
//         }
//       }

//       return NextResponse.json(
//         { message: "Habits updated successfully" },
//         { status: 200 }
//       );
//     } else {
//       return NextResponse.json(
//         { message: "No journal entry found for yesterday" },
//         { status: 200 }
//       );
//     }
//   } catch (error) {
//     console.error("Error in cron job:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
