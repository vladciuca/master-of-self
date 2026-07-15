import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import type { User } from "@models/types";
import type { Practice } from "@models/mongodb";

export function useAllPractices() {
  const { user } = useUser() as { user: User | null };

  const [practices, setPractices] = useState<Practice[]>([]);
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

    const fetchAllPractices = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/practice/all/?userId=${user.id}`,
          {
            signal,
          }
        );

        if (signal.aborted) return;

        if (!response.ok) {
          throw new Error("Failed to fetch practices");
        }

        const data = await response.json();

        const formattedPractices = data.practices.map(
          (item: Practice) => ({
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

        setPractices(formattedPractices);
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          console.warn("Fetch aborted");
          return;
        }

        console.error("Error fetching all practices", error);
        setError("Failed to load practices. Please try again.");
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchAllPractices();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  return {
    practices,
    loading,
    error,
  };
}
