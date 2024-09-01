// "use client";

// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import FormStepController from "@components/journal-entry-form/FormStepController";
// import PageLogo from "@components/PageLogo";

// export interface JournalEntry {
//   dailyWillpower: number;
//   dayEntry?: {
//     greatToday?: string[];
//     gratefulFor?: string[];
//   };
//   nightEntry?: {
//     dailyHighlights?: string[];
//   };
// }

// const UpdateJournalEntry = () => {
//   const params = useParams<{ id: string }>();
//   const { id } = params;
//   const [submitting, setSubmitting] = useState(false);
//   const [journalEntryData, setJournalEntryData] = useState<JournalEntry | null>(
//     null
//   );

//   useEffect(() => {
//     const getJournalEntryData = async () => {
//       const response = await fetch(`/api/journal-entry/${id}`, {
//         method: "GET",
//       });
//       const data = await response.json();
//       setJournalEntryData(data);
//     };
//     getJournalEntryData();
//   }, [id]);

//   const updateJournalEntry = async (journalEntry: JournalEntry) => {
//     setSubmitting(true);

//     try {
//       const response = await fetch(`/api/journal-entry/${id}`, {
//         method: "PATCH",
//         body: JSON.stringify(journalEntry),
//       });

//       if (response.ok) {
//         setJournalEntryData(journalEntry);
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return journalEntryData ? (
//     <FormStepController
//       journalEntryData={journalEntryData}
//       submitting={submitting}
//       onSubmit={updateJournalEntry}
//     />
//   ) : (
//     <PageLogo />
//   );
// };

// export default UpdateJournalEntry;

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import FormStepController from "@components/journal-entry-form/FormStepController";
import PageLogo from "@components/PageLogo";

export interface JournalEntry {
  dailyWillpower: number;
  bonusWillpower: number;
  dayEntry?: {
    greatToday?: string[];
    gratefulFor?: string[];
  };
  nightEntry?: {
    dailyHighlights?: string[];
  };
}

const UpdateJournalEntry = () => {
  const params = useParams<{ id: string }>();
  const { id } = params;
  const [submitting, setSubmitting] = useState(false);
  const [journalEntryData, setJournalEntryData] = useState<JournalEntry | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getJournalEntryData = async () => {
      try {
        const response = await fetch(`/api/journal-entry/${id}`, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch journal entry");
        }
        const data = await response.json();
        setJournalEntryData(data);
      } catch (error) {
        console.error("Error fetching journal entry:", error);
        setError("Failed to load journal entry. Please try again.");
      }
    };
    getJournalEntryData();
  }, [id]);

  const updateJournalEntry = async (journalEntry: JournalEntry) => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/journal-entry/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(journalEntry),
      });

      if (!response.ok) {
        throw new Error("Failed to update journal entry");
      }

      const updatedData = await response.json();
      setJournalEntryData(updatedData);
    } catch (error) {
      console.error("Error updating journal entry:", error);
      setError("Failed to update journal entry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return journalEntryData ? (
    <FormStepController
      journalEntryData={journalEntryData}
      submitting={submitting}
      onSubmit={updateJournalEntry}
    />
  ) : (
    <PageLogo />
  );
};

export default UpdateJournalEntry;
