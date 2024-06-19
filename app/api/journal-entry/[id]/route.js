export const GET = async (req) => {
  try {
    console.log("TEST ROUTE SO TYPESCRIPT DOESN'T THROW ERROR");
    return new Response(JSON.stringify(journalEntries), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch all habits", { status: 500 });
  }
};
