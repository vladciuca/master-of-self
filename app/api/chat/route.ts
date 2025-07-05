// // // // 2. A set of 3 **Disciplines** — internal traits or personal qualities to support the goal. Each discipline includes:
// // // //    - **Discipline Name** (e.g. "Consistency", "Courage")
// // // //    - **Type**: Either "dayEntry" (for morning reflection) or "nightEntry" (for evening reflection)
// // // //    - **Title**: A daily journal prompt (e.g. "What fear will I face today?")
// // // //    - **Description**: A short guideline on how to respond to that prompt

import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const {
    message,
    timeUnit, // "weeks" or "months"
    totalMilestones, // user's selected "number of major milestones"
    totalDuration, // Total weeks/months for the selected timeframe
  } = await req.json();

  // Define the schema for Objective and Milestone
  const objectiveSchema = `{
    "title": "Specific Objective Title (e.g., Learn Basic Greetings)",
    "tasks": ["Task 1: Listen to Spanish podcasts daily", "Task 2: Practice with a tutor"]
  }`;

  const milestoneSchema = `{
    "number": 1, // Sequential milestone number
    "title": "Milestone 1: [Concise Name]",
    "focus": "High-level theme or goal for this milestone",
    "timeframe": "${
      timeUnit.charAt(0).toUpperCase() + timeUnit.slice(1)
    } X-Y", // e.g., "Week 1-2" or "Month 3"
    "objectives": [
      ${objectiveSchema}
      // ... More objectives (1-3 per milestone)
    ]
  }`;

  const systemPrompt = `You are a coaching assistant helping users reach their goals through structured roadmaps.
Based on the user's goal and specified timeframe, break their journey into major milestones, each with specific objectives and actionable tasks.

Respond ONLY in valid JSON. No markdown, no extra explanations.

Return this exact JSON structure:
{
  "title": "A ${totalMilestones}-Milestone Roadmap to [User's Goal]",
  "description": "Encouraging overview of the user's transformation journey.",
  "totalMilestones": ${totalMilestones},
  "timeUnit": "${timeUnit}",
  "totalDuration": ${totalDuration},
  "milestones": [
    ${milestoneSchema},
    // Repeat for each of the ${totalMilestones} milestones
  ]
}

Guidelines for generating content:
- The roadmap should be exactly ${totalMilestones} milestones long.
- Split the total duration (${totalDuration} ${timeUnit}s) as evenly as possible among the ${totalMilestones} milestones.
  - For example, if totalDuration is 4 ${timeUnit}s and totalMilestones is 2, timeframes would be "${
    timeUnit.charAt(0).toUpperCase() + timeUnit.slice(1)
  } 1-2" and "${timeUnit.charAt(0).toUpperCase() + timeUnit.slice(1)} 3-4".
  - If a milestone covers only one unit, use "Week X" or "Month X" (e.g., "Week 1" instead of "Week 1-1").
- Each milestone (object within the "milestones" array) should have:
  - "number": The sequential milestone number (1 to ${totalMilestones}).
  - "title": A clear and concise name (e.g., "Milestone 1: Foundation Setup").
  - "focus": A high-level theme or goal for this milestone.
  - "timeframe": The specific time range this milestone covers within the overall journey (e.g., "Week 1-3", "Month 4"). This should be accurate based on the even division.
  - "objectives": An array containing 1-3 "Objective" objects.
- Each objective (object within the "objectives" array) should have:
  - "title": A specific, measurable objective (e.g., "Complete a beginner's course").
  - "tasks": An array containing 2-4 concrete, actionable "Task" strings to achieve that objective.

Be encouraging but concise. Focus on practical steps for personal growth.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        { role: "user", content: message },
      ],
      response_format: { type: "json_object" },
    });

    console.log("🧠 Token Usage:", response.usage);

    const rawContent = response.choices[0].message.content;

    if (rawContent === null) {
      console.error("OpenAI returned null content.");
      return NextResponse.json({
        error: "AI did not return any content. Please try again.",
        rawResponse: null,
      });
    }

    let roadmapData;
    try {
      roadmapData = JSON.parse(rawContent);
    } catch (error: unknown) {
      console.error("Failed to parse JSON response:", error);
      let errorMessage =
        "Failed to parse roadmap data from AI. Please try again.";
      if (error instanceof Error) {
        errorMessage += ` Error details: ${error.message}`;
      } else if (typeof error === "string") {
        errorMessage += ` Error details: ${error}`;
      }

      return NextResponse.json({
        error: errorMessage,
        rawResponse: rawContent,
      });
    }

    return NextResponse.json({ reply: roadmapData });
  } catch (error: unknown) {
    console.error("API Call Error:", error);

    let errorMessage =
      "An unknown error occurred while communicating with the AI.";
    if (error instanceof OpenAI.APIError) {
      errorMessage = `OpenAI API Error: ${error.status} - ${error.message}`;
      console.error(
        "OpenAI API Error Details:",
        error.code,
        error.type,
        error.param
      );
    } else if (error instanceof Error) {
      errorMessage = `Application Error: ${error.message}`;
    } else if (typeof error === "string") {
      errorMessage = `String Error: ${error}`;
    }

    return NextResponse.json({
      error: errorMessage,
      rawResponse: error instanceof Error ? error.message : String(error),
    });
  }
}
