import * as z from "zod";

export const habitFormSchema = z.object({
  name: z
    .string()
    .min(3, "Habit name must contain at least 3 characters")
    .max(25, "Habit name must contain maximum 25 characters"),
  icon: z.string().min(1, "Please select an icon"),
  description: z.string().min(3, "Please add a habit description"),
  xp: z.number().optional(),
  actions: z
    .array(
      z.object({
        action: z.string(),
        type: z.enum(["offensive", "defensive"]),
        metric: z.enum(["count", "time"]),
        value: z.number().default(0),
      })
    )
    .min(1, "Please add a habit action"),
});

export type HabitZodType = z.infer<typeof habitFormSchema>;
