// Helper function to handle API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  return response.json();
}

export async function fetchHabits(userId: string) {
  try {
    const response = await fetch(`/api/users/${userId}/habits`);
    const data = await handleResponse(response);
    return data.reverse();
  } catch (error) {
    console.error("Failed to fetch habits", error);
    throw error;
  }
}

export async function fetchJournalEntries(userId: string) {
  try {
    const response = await fetch(`/api/users/${userId}/journal-entries`);
    const data = await handleResponse(response);
    return data.reverse();
  } catch (error) {
    console.error("Failed to fetch journal entries", error);
    throw error;
  }
}

export async function fetchUserSettings(userId: string) {
  try {
    const response = await fetch(`/api/users/${userId}/settings`);
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.error("Failed to fetch user settings", error);
    throw error;
  }
}
