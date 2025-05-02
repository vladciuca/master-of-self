import { useState, useEffect, useRef } from "react";
import type { UserMetadata } from "@models/types";

export function useUserData(userId: string) {
  const [user, setUser] = useState<UserMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Ref for abort controller
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Cancel any in-progress operation from previous effects
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController for this operation
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const fetchUserProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/users/${userId}/profile`, {
          signal,
        });

        if (signal.aborted) return;

        if (!response.ok) {
          throw new Error(`Failed to fetch user: ${response.statusText}`);
        }

        const userData = await response.json();

        if (signal.aborted) return;

        setUser(userData);
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          console.log("Fetch operation aborted");
          return;
        }

        console.error("Error fetching user profile:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        setUser(null);
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();

    // Cleanup on unmount or when dependencies change
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [userId]);

  return { user, loading, error };
}
