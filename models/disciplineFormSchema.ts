import * as z from "zod";

export const disciplineFormSchema = z.object({
  id: z.string().optional(),
  discipline: z
    .string()
    .min(3, "Discipline name must contain at least 3 characters"),
  icon: z.string().min(1, "Please select a icon"),
  type: z.enum(["dayEntry", "nightEntry"]),
  title: z.string().min(2, "Title must contain at least 2 characters"),
  description: z
    .string()
    .min(2, "Description must contain at least 2 characters"),
});

export type DisciplineZodType = z.infer<typeof disciplineFormSchema>;
