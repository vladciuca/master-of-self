import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import type { User } from "@models/types";
import type { Discipline } from "@models/mongodb";

export function useAllDisciplines() {
  const { user } = useUser() as { user: User | null };

  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const fetchAllDisciplines = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/discipline/all/?userId=${user.id}`,
          {
            signal,
          }
        );

        if (signal.aborted) return;

        if (!response.ok) {
          throw new Error("Failed to fetch disciplines");
        }

        const data = await response.json();

        const formattedDisciplines = data.disciplines.map(
          (item: Discipline) => ({
            discipline: item.discipline,
            icon: item.icon,
            color: item.color,
            type: item.type,
            title: item.title,
            description: item.description,
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

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  return {
    disciplines,
    loading,
    error,
  };
}
