const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper function to handle API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  return response.json();
}

// Helper function to get the full API URL
function getApiUrl(path: string): string {
  // Check if we're on the client side
  if (typeof window !== "undefined") {
    return `/api${path}`; // Use relative URL for client-side requests
  }
  // We're on the server side
  return `${API_BASE_URL}/api${path}`; // Use full URL for server-side requests
}

export async function fetchHabits(userId: string) {
  try {
    const response = await fetch(getApiUrl(`/users/${userId}/habits`), {
      method: "GET",
    });
    const data = await handleResponse(response);
    return data.reverse();
  } catch (error) {
    console.error("Failed to fetch habits", error);
    throw error;
  }
}

export async function fetchJournalEntries(userId: string) {
  try {
    const response = await fetch(
      getApiUrl(`/users/${userId}/journal-entries`),
      {
        method: "GET",
      }
    );
    const data = await handleResponse(response);
    return data.reverse();
  } catch (error) {
    console.error("Failed to fetch journal entries", error);
    throw error;
  }
}

export async function fetchUserSettings(userId: string) {
  try {
    const response = await fetch(getApiUrl(`/users/${userId}/settings`), {
      method: "GET",
    });
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.error("Failed to fetch user settings", error);
    throw error;
  }
}
