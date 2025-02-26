import * as z from "zod";

const actionSchema = z.object({
  id: z.string().optional(),
  task: z.string().min(3, "Action must contain at least 3 characters"),
  unit: z.string().min(2, "Unit must contain at least 2 characters"),
  type: z.enum(["build", "break"]),
  metric: z.enum(["count", "time"]),
  value: z.number().default(0),
  dailyTarget: z.number().min(1).default(1),
});

export const habitFormSchema = z.object({
  id: z.string().optional(),
  category: z
    .string()
    .min(3, "Habit category name must contain at least 3 characters")
    .max(25, "Habit category name must contain maximum 25 characters"),
  icon: z.string().min(1, "Please select a category icon"),
  xp: z.number().optional(),
  actions: z.array(actionSchema).min(1, "Please add a habit action"),
});

export type HabitZodType = z.infer<typeof habitFormSchema>;
