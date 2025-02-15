// import {
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "@components/ui/form";
// import { Textarea } from "@components/ui/textarea";
// import { Control } from "react-hook-form";
// import { HabitZodType } from "@components/habits/habit-form/habitFormSchema";

// type DescriptionFieldProps = {
//   control: Control<HabitZodType>;
// };

// export function DescriptionField({ control }: DescriptionFieldProps) {
//   return (
//     <FormField
//       control={control}
//       name="description"
//       render={({ field }) => (
//         <FormItem>
//           <FormLabel>Habit description</FormLabel>
//           <FormControl>
//             <Textarea
//               className="text-base"
//               placeholder="How can this action help you achieve your goals?"
//               {...field}
//             />
//           </FormControl>
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );
// }
