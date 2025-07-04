// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(req) {
//   const { message } = await req.json();

//   const response = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//       // { role: "system", content: "You are a helpful assistant." },
//       {
//         role: "system",
//         content: `You are a coaching assistant helping users become the person they need to be to reach their goals. When a user shares a goal (like "I want to get hired as a programmer within {x} months"), your job is to generate:

// A personalized {x}-month **Roadmap Overview**, broken into monthly plans, with milestones and action points. Use a clear, encouraging tone and structured format. Make it feel like a coach wrote it.

// Respond in a clean, markdown-friendly format that can be rendered on the front end — use headers (###), lists, and separators (---) for readability.

// Be supportive, motivating, and actionable. Your job is to turn ambition into a clear, structured, personal growth plan.

// Always respond with the full roadmap.`,
//       },
//       { role: "user", content: message },
//     ],
//   });

//   // Log token usage
//   console.log("🧠 Token Usage:", response.usage);

//   return Response.json({ reply: response.choices[0].message.content });
// }

// // 2. A set of 3 **Disciplines** — internal traits or personal qualities to support the goal. Each discipline includes:
// //    - **Discipline Name** (e.g. "Consistency", "Courage")
// //    - **Type**: Either "dayEntry" (for morning reflection) or "nightEntry" (for evening reflection)
// //    - **Title**: A daily journal prompt (e.g. "What fear will I face today?")
// //    - **Description**: A short guideline on how to respond to that prompt
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const { message } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a coaching assistant helping users become the person they need to be to reach their goals. When a user shares a goal (like "I want to get hired as a programmer within {x} months"), your job is to generate a personalized roadmap.

IMPORTANT: You must respond with valid JSON only. No markdown, no additional text, just pure JSON.

The JSON structure should be:
{
  "title": "X-Month Roadmap to [Goal]",
  "description": "Brief encouraging description",
  "totalMonths": X,
  "roadmap": [
    {
      "month": 1,
      "title": "Month Title",
      "focus": "Main focus area",
      "milestones": [
        "First milestone",
        "Second milestone"
      ],
      "actionPoints": [
        "First action point",
        "Second action point",
        "Third action point"
      ]
    }
  ]
}

Be supportive, motivating, and actionable. Create a clear, structured, personal growth plan. Always respond with valid JSON only.`,
      },
      { role: "user", content: message },
    ],
  });

  // Log token usage
  console.log("🧠 Token Usage:", response.usage);

  // Parse the JSON response
  let roadmapData;
  try {
    roadmapData = JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    return Response.json({
      error: "Failed to parse roadmap data",
      rawResponse: response.choices[0].message.content,
    });
  }

  return Response.json({ reply: roadmapData });
}
