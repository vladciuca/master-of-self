import * as z from "zod";
import { DISCIPLINES } from "@lib/disciplines";

const SELECTABLE_DISCIPLINES = DISCIPLINES.filter(
  (discipline) => discipline.discipline !== "Discipline"
).map((discipline) => discipline.discipline) as [string, ...string[]];

export const practiceFormSchema = z.object({
  id: z.string().optional(),
  discipline: z.enum(SELECTABLE_DISCIPLINES, {
    message: "Please select a discipline",
  }),
  icon: z.string().min(1, "Please select a icon"),
  color: z.string().min(1, "Color is required"),
  type: z.enum(["dayEntry", "nightEntry"]),
  title: z.string().min(2, "Title must contain at least 2 characters"),
  description: z
    .string()
    .min(2, "Description must contain at least 2 characters"),
});

export type PracticeZodType = z.infer<typeof practiceFormSchema>;
