import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import type { Session } from "@models/types";
import type { Discipline } from "@models/mongodb";

//NOTE: This returns all disciplines in DB, except for current user disciplines
export function useAllDisciplines() {
  const { data: session } = useSession() as { data: Session | null };

  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ref for abort controller
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  // Fetch all disciplines
  useEffect(() => {
    if (!session?.user.id) return;

    // Cancel any in-progress fetch
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Create a new AbortController for this fetch
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const fetchAllDisciplines = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/discipline/all/?userId=${session.user.id}`,
          {
            signal,
          }
        );

        if (signal.aborted) return;

        if (!response.ok) {
          throw new Error("Failed to fetch disciplines");
        }

        const data = await response.json();

        // Transform the data to match DisciplineZodType
        const formattedDisciplines = data.disciplines.map(
          (item: Discipline) => ({
            discipline: item.discipline,
            icon: item.icon,
            color: item.color,
            type: item.type,
            title: item.title,
            description: item.description,
            // Optional: include the ID if needed for further operations
            _id: item._id,
            creatorId: item.creatorId,
          })
        );

        setDisciplines(formattedDisciplines);
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          console.warn("Fetch aborted");
          return;
        }

        console.error("Error fetching all disciplines", error);
        setError("Failed to load disciplines. Please try again.");
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchAllDisciplines();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  // Function to refresh data manually if needed
  //   const refreshDisciplines = () => {
  //     // Cancel any in-progress fetch
  //     if (abortControllerRef.current) {
  //       abortControllerRef.current.abort();
  //       abortControllerRef.current = null;
  //     }

  //     // Reset states
  //     setLoading(true);
  //     setError(null);

  //     // Create a new AbortController
  //     abortControllerRef.current = new AbortController();

  //     // Trigger a re-run of the useEffect by updating a dependency
  //     // Since useEffect has no dependencies, we need to manually call the fetch function
  //     const fetchDisciplines = async () => {
  //       try {
  //         const response = await fetch("/api/discipline/all", {
  //           signal: abortControllerRef.current?.signal,
  //         });

  //         if (!response.ok) {
  //           throw new Error("Failed to fetch disciplines");
  //         }

  //         const data = await response.json();

  //         const formattedDisciplines = data.disciplines.map((item: any) => ({
  //           discipline: item.discipline,
  //           icon: item.icon,
  //           color: item.color,
  //           type: item.type,
  //           title: item.title,
  //           description: item.description,
  //           _id: item._id,
  //           creatorId: item.creatorId,
  //         }));

  //         setDisciplines(formattedDisciplines);
  //       } catch (error) {
  //         if ((error as Error).name === "AbortError") {
  //           console.log("Fetch aborted");
  //           return;
  //         }
  //         console.error("Error refreshing disciplines", error);
  //         setError("Failed to refresh disciplines. Please try again.");
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchDisciplines();
  //   };

  return {
    disciplines,
    loading,
    error,
    // refreshDisciplines,
  };
}
