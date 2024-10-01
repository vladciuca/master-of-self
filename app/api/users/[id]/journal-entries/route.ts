import { NextRequest, NextResponse } from "next/server";
import { getJournalEntries } from "lib/mongo/journal-entries";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  try {
    const { journalEntries, error } = await getJournalEntries(userId);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    if (!journalEntries) {
      return NextResponse.json(
        { error: "No journal entries found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { journalEntries: journalEntries },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const userId = params.id;
//   const { searchParams } = new URL(request.url);
//   const today = searchParams.get("today");
//   const yesterday = searchParams.get("yesterday");

//   if (!today || !yesterday) {
//     return NextResponse.json(
//       { error: "Missing today or yesterday parameter" },
//       { status: 400 }
//     );
//   }

//   try {
//     // Change: Call getYesterdaysJournalEntry instead of getJournalEntries
//     const { yesterdaysJournalEntry } = await getYesterdaysJournalEntry(
//       userId,
//       today,
//       yesterday
//     );

//     // Change: Always return a 200 status, with null if no entry found
//     return NextResponse.json({ yesterdaysJournalEntry }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching yesterday's journal entry:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
