import { NextResponse, NextRequest } from "next/server";
import {
  getJournalEntry,
  updateJournalEntry,
} from "@lib/mongo/journal-entries";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const routeParams = await params;
  try {
    const { journalEntry, error } = await getJournalEntry(routeParams.id);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    if (!journalEntry)
      return new NextResponse("Journal entry not found", { status: 404 });

    return new NextResponse(JSON.stringify(journalEntry), { status: 200 });
  } catch (error) {
    return new NextResponse("Failed to fetch habit", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const routeParams = await params;
  const { dailyWillpower, dayEntry, nightEntry, habits } = await req.json();

  try {
    const { journalEntry, error } = await updateJournalEntry(
      routeParams.id,
      dailyWillpower,
      dayEntry,
      nightEntry,
      habits
    );

    if (error) {
      return new NextResponse(error, { status: 404 });
    }

    return new NextResponse(JSON.stringify(journalEntry), { status: 200 });
  } catch (error) {
    return new NextResponse("Failed to update journal entry", { status: 500 });
  }
}

// // test purposes
// export const DELETE = async (
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) => {
//   try {
//     // await connectToDB();

//     await JournalEntry.findByIdAndDelete(params.id);

//     return new NextResponse("Journal Entry was deleted successfully", {
//       status: 200,
//     });
//   } catch (error) {
//     console.log(error);
//     return new NextResponse("Failed to delete Journal Entry", { status: 500 });
//   }
// };
