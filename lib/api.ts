const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
// Helper function to handle API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  return response.json();
}

// // Helper function to get the full API URL
// function getApiUrl(path: string): string {
//   // Check if we're on the client side
//   if (typeof window !== "undefined") {
//     console.log("===ON CLIENT:", `/api${path}`);
//     return `/api${path}`; // Use relative URL for client-side requests
//   }
//   // We're on the server side
//   console.log("===ON SERVER:", `${API_BASE_URL}/api${path}`);
//   return `${API_BASE_URL}/api${path}`; // Use full URL for server-side requests
// }

export async function fetchHabits(userId: string) {
  try {
    const response = await fetch(`${baseUrl}/api/users/${userId}/habits`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await handleResponse(response);
    console.log("Fetched data:", data);
    return data.reverse();
  } catch (error) {
    console.error("Failed to fetch habits", error);
    throw error;
  }
}

export async function fetchJournalEntries(userId: string) {
  try {
    const response = await fetch(
      `${baseUrl}/api/users/${userId}/journal-entries`,
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
    const response = await fetch(`${baseUrl}/api/users/${userId}/settings`, {
      method: "GET",
    });
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.error("Failed to fetch user settings", error);
    throw error;
  }
}
