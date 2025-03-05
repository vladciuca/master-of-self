"use client";

import { useCallback, useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { actionSchema } from "@models/habitFormSchema";
import * as z from "zod";
const actionSchema = z.object({
  task: z.string().min(3, "Action must contain at least 3 characters"),
  unit: z.string().min(2, "Unit must contain at least 2 characters"),
  type: z.enum(["build", "break"]),
  metric: z.enum(["count", "time"]),
  dailyTarget: z.number().min(1).default(1),
});

import type { HabitAction } from "@models/types";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Slider } from "@components/ui/slider";
import { ScrollArea } from "@components/ui/scroll-area";

import {
  ActionIcon,
  MetricIcon,
} from "@components/habits/habit-actions/HabitActionIcons";
import { ArrowBigRightDash } from "lucide-react";

type ActionFormProps = {
  // onSubmit: (data: Omit<HabitAction, "id" | "value">) => void;
  onAddAction: (data: Omit<HabitAction, "id" | "value">) => void;
  initialData?: HabitAction | null;
  handleCloseDrawer: () => void;
};

const initialActionState = {
  task: "",
  unit: "",
  metric: "count" as const,
  type: "build" as const,
  dailyTarget: 1,
};

export function ActionForm({
  // onSubmit,
  onAddAction,
  initialData,
  handleCloseDrawer,
}: ActionFormProps) {
  // const form = useForm<Omit<HabitAction, "id" | "value">>({
  //   resolver: zodResolver(habitFormSchema.shape.actions.element),
  //   defaultValues: initialData || initialActionForm,
  // });
  const [actionData, setActionData] = useState<
    Omit<HabitAction, "id" | "value">
  >(initialData || initialActionState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: any) => {
    try {
      const fieldSchema =
        actionSchema.shape[name as keyof typeof actionSchema.shape];
      fieldSchema.parse(value);
      setErrors((prev) => ({ ...prev, [name]: "" }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors[0]?.message || "Invalid input";
        setErrors((prev) => ({ ...prev, [name]: fieldError }));
      }
      return false;
    }
  };

  const handleInputChange = (name: keyof typeof actionData, value: any) => {
    setActionData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleAddAction = useCallback(() => {
    try {
      // Validate all fields
      actionSchema.parse(actionData);

      // If validation passes, add the action
      onAddAction(actionData);

      // Reset form if not editing
      if (!initialData) {
        setActionData(initialActionState);
      }

      // Close drawer
      handleCloseDrawer();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  }, [actionData, onAddAction, initialData, handleCloseDrawer]);
  // const handleFocusInput = (e: React.PointerEvent<HTMLInputElement>) => {
  //   e.stopPropagation();
  //   e.preventDefault();
  //   e.currentTarget.focus();
  // };

  // const handleSubmit = useCallback(
  //   (data: Omit<HabitAction, "id" | "value">) => {
  //     onSubmit(data);
  //     form.reset();
  //   },
  //   [onSubmit, form]
  // );

  // const handleFormSubmit = useCallback(
  //   (e: React.MouseEvent<HTMLButtonElement>) => {
  //     e.preventDefault();
  //     e.stopPropagation();
  //     form.handleSubmit(handleSubmit)();
  //   },
  //   [form, handleSubmit]
  // );

  return (
    // <Form {...form}>
    //   <form onSubmit={form.handleSubmit(handleSubmit)}>
    //     <ScrollArea className="h-[65vh] p-4">
    //       <DrawerHeader>
    //         <DrawerTitle className="text-center flex flex-col">
    //           {initialData ? "Edit Action" : "Add New Action"}
    //           <div className="w-full">
    //             <div className="flex items-center justify-center space-x-4 mt-6">
    //               <ActionIcon
    //                 type={form.watch("type")}
    //                 dailyTargetCompleted={false}
    //                 overCapped={false}
    //                 size={30}
    //               />
    //               <ArrowBigRightDash />
    //               <ActionIcon
    //                 type={form.watch("type")}
    //                 dailyTargetCompleted={true}
    //                 overCapped={false}
    //                 size={30}
    //               />
    //             </div>
    //           </div>
    //         </DrawerTitle>
    //         <DrawerDescription className="text-center mt-2">
    //           {initialData
    //             ? "Edit your habit action details below"
    //             : "Add a new habit action by filling out the details below"}
    //         </DrawerDescription>
    //       </DrawerHeader>
    //       <div className="px-1 pb-4 space-y-4">
    //         <FormField
    //           control={form.control}
    //           name="type"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>I want to...</FormLabel>
    //               <Select
    //                 onValueChange={field.onChange}
    //                 defaultValue={field.value}
    //               >
    //                 <FormControl>
    //                   <SelectTrigger>
    //                     <SelectValue placeholder="Select action type" />
    //                   </SelectTrigger>
    //                 </FormControl>
    //                 <SelectContent>
    //                   <SelectItem value="build">
    //                     <span className="flex items-center">
    //                       <ActionIcon type="build" size={20} />
    //                       <span className="ml-2">Build a habit</span>
    //                     </span>
    //                   </SelectItem>
    //                   <SelectItem value="break">
    //                     <span className="flex items-center">
    //                       <ActionIcon type="break" size={20} />
    //                       <span className="ml-2">Break a habit</span>
    //                     </span>
    //                   </SelectItem>
    //                 </SelectContent>
    //               </Select>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />

    //         <FormField
    //           control={form.control}
    //           name="task"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>
    //                 {form.watch("type") === "build"
    //                   ? "I will..."
    //                   : "I won't..."}
    //               </FormLabel>
    //               <FormControl>
    //                 <Input
    //                   className="text-base"
    //                   placeholder="e.g., Do pushups, Read books, Meditate"
    //                   // onPointerDown={handleFocusInput}
    //                   {...field}
    //                 />
    //               </FormControl>
    //               <FormDescription>
    //                 Describe the specific action you'll take. Make it clear and
    //                 measurable.
    //               </FormDescription>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />

    //         {/* Action Form field for METRIC(currently hidden and set as default value - first option) */}
    //         {/* <FormField
    //           control={form.control}
    //           name="metric"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Action tracking metric</FormLabel>
    //               <Select
    //                 onValueChange={field.onChange}
    //                 defaultValue={field.value}
    //               >
    //                 <FormControl>
    //                   <SelectTrigger>
    //                     <SelectValue placeholder="Select metric" />
    //                   </SelectTrigger>
    //                 </FormControl>
    //                 <SelectContent>
    //                   <SelectItem value="count">
    //                     <span className="flex items-center">
    //                       <span className="mr-2">
    //                         <MetricIcon metric="count" size={18} />
    //                       </span>
    //                       Count
    //                     </span>
    //                   </SelectItem>
    //                   <SelectItem value="time">
    //                     <span className="flex items-center">
    //                       <span className="mr-2">
    //                         <MetricIcon metric="time" size={18} />
    //                       </span>
    //                       Time
    //                     </span>
    //                   </SelectItem>
    //                 </SelectContent>
    //               </Select>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         /> */}

    //         <FormField
    //           control={form.control}
    //           name="unit"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Tracking Unit</FormLabel>
    //               <FormControl>
    //                 <Input
    //                   className="text-base"
    //                   placeholder="e.g., repetitions, pages, minutes"
    //                   // onPointerDown={handleFocusInput}
    //                   {...field}
    //                 />
    //               </FormControl>
    //               <FormDescription>
    //                 Choose the unit that best measures your action (what you'll
    //                 count or track each day)
    //               </FormDescription>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />

    //         <FormField
    //           control={form.control}
    //           name="dailyTarget"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel className="flex items-center mb-6">
    //                 Daily {form.watch("type") === "build" ? "Target" : "Limit"}:
    //                 <span className="ml-2 space-x-1 text-lg flex items-center">
    //                   <MetricIcon metric={form.watch("metric")} size={20} />
    //                   <span></span>
    //                   {field.value}
    //                 </span>
    //               </FormLabel>
    //               <FormControl>
    //                 <div className="flex items-center">
    //                   <Slider
    //                     min={1}
    //                     max={10}
    //                     step={1}
    //                     value={[field.value]}
    //                     onValueChange={(value) => field.onChange(value[0])}
    //                   />
    //                 </div>
    //               </FormControl>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />
    //       </div>
    //     </ScrollArea>

    //     <div className="flex flex-col justify-center items-center my-2 px-4">
    //       <Button
    //         className="w-full mt-3 mb-4"
    //         type="submit"
    //         onClick={handleFormSubmit}
    //       >
    //         {initialData ? "Update Action" : "Add Action"}
    //       </Button>
    //       <Button
    //         type="button"
    //         variant="outline"
    //         className="w-full"
    //         onClick={handleCloseDrawer}
    //       >
    //         Cancel
    //       </Button>
    //     </div>
    //   </form>
    // </Form>
    <div>
      <ScrollArea className="h-[65vh] p-4">
        <DrawerHeader>
          <DrawerTitle className="text-center flex flex-col">
            {initialData ? "Edit Action" : "Add New Action"}
            <div className="w-full">
              <div className="flex items-center justify-center space-x-4 mt-6">
                <ActionIcon
                  type={actionData.type}
                  dailyTargetCompleted={false}
                  overCapped={false}
                  size={30}
                />
                <ArrowBigRightDash />
                <ActionIcon
                  type={actionData.type}
                  dailyTargetCompleted={true}
                  overCapped={false}
                  size={30}
                />
              </div>
            </div>
          </DrawerTitle>
          <DrawerDescription className="text-center mt-2">
            {initialData
              ? "Edit your habit action details below"
              : "Add a new habit action by filling out the details below"}
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-1 pb-4 space-y-4">
          <FormItem
          // className={errors.type ? "text-destructive" : ""}
          >
            <FormLabel>I want to...</FormLabel>
            <Select
              value={actionData.type}
              onValueChange={(value) => handleInputChange("type", value)}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select action type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="build">
                  <span className="flex items-center">
                    <ActionIcon type="build" size={20} />
                    <span className="ml-2">Build a habit</span>
                  </span>
                </SelectItem>
                <SelectItem value="break">
                  <span className="flex items-center">
                    <ActionIcon type="break" size={20} />
                    <span className="ml-2">Break a habit</span>
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <FormMessage>{errors.type}</FormMessage>}
          </FormItem>

          <FormItem className={errors.task ? "text-destructive" : ""}>
            <FormLabel>
              {actionData.type === "build" ? "I will..." : "I won't..."}
            </FormLabel>
            <FormControl>
              <Input
                className="text-base"
                placeholder="e.g., Do pushups, Read books, Meditate"
                value={actionData.task}
                onChange={(e) => handleInputChange("task", e.target.value)}
              />
            </FormControl>
            <FormDescription>
              Describe the specific action you'll take. Make it clear and
              measurable.
            </FormDescription>
            {errors.task && <FormMessage>{errors.task}</FormMessage>}
          </FormItem>

          {/* Action Form field for METRIC(currently hidden and set as default value - first option) */}
          {/* <FormField
    //           control={form.control}
    //           name="metric"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Action tracking metric</FormLabel>
    //               <Select
    //                 onValueChange={field.onChange}
    //                 defaultValue={field.value}
    //               >
    //                 <FormControl>
    //                   <SelectTrigger>
    //                     <SelectValue placeholder="Select metric" />
    //                   </SelectTrigger>
    //                 </FormControl>
    //                 <SelectContent>
    //                   <SelectItem value="count">
    //                     <span className="flex items-center">
    //                       <span className="mr-2">
    //                         <MetricIcon metric="count" size={18} />
    //                       </span>
    //                       Count
    //                     </span>
    //                   </SelectItem>
    //                   <SelectItem value="time">
    //                     <span className="flex items-center">
    //                       <span className="mr-2">
    //                         <MetricIcon metric="time" size={18} />
    //                       </span>
    //                       Time
    //                     </span>
    //                   </SelectItem>
    //                 </SelectContent>
    //               </Select>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         /> */}
          <FormItem className={errors.unit ? "text-destructive" : ""}>
            <FormLabel>Tracking Unit</FormLabel>
            <FormControl>
              <Input
                className="text-base"
                placeholder="e.g., repetitions, pages, minutes"
                value={actionData.unit}
                onChange={(e) => handleInputChange("unit", e.target.value)}
              />
            </FormControl>
            <FormDescription>
              Choose the unit that best measures your action (what you'll count
              or track each day)
            </FormDescription>
            {errors.unit && <FormMessage>{errors.unit}</FormMessage>}
          </FormItem>

          <FormItem className={errors.dailyTarget ? "text-destructive" : ""}>
            <FormLabel className="flex items-center mb-6">
              Daily {actionData.type === "build" ? "Target" : "Limit"}:
              <span className="ml-2 space-x-1 text-lg flex items-center">
                <MetricIcon metric={actionData.metric} size={20} />
                <span></span>
                {actionData.dailyTarget}
              </span>
            </FormLabel>
            <FormControl>
              <div className="flex items-center">
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[actionData.dailyTarget]}
                  onValueChange={(value) =>
                    handleInputChange("dailyTarget", value[0])
                  }
                />
              </div>
            </FormControl>
            {errors.dailyTarget && (
              <FormMessage>{errors.dailyTarget}</FormMessage>
            )}
          </FormItem>
        </div>
      </ScrollArea>

      <div className="flex flex-col justify-center items-center my-2 px-4">
        <Button
          className="w-full mt-3 mb-4"
          type="button"
          onClick={handleAddAction}
        >
          {initialData ? "Update Action" : "Add Action"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleCloseDrawer}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
//===============================================
// "use client";

// import { useCallback } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { habitFormSchema } from "@models/habitFormSchema";
// import type { HabitAction } from "@models/types";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormDescription,
//   FormControl,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   DrawerHeader,
//   DrawerTitle,
//   DrawerDescription,
// } from "@/components/ui/drawer";
// import { Input } from "@/components/ui/input";
// import { Slider } from "@components/ui/slider";
// import { ScrollArea } from "@components/ui/scroll-area";

// import {
//   ActionIcon,
//   MetricIcon,
// } from "@components/habits/habit-actions/HabitActionIcons";
// import { ArrowBigRightDash } from "lucide-react";

// // Import the action schema from habitFormSchema
// const actionSchema = habitFormSchema.shape.actions.element;

// type ActionFormProps = {
//   handleActionSubmit: (data: Omit<HabitAction, "id" | "value">) => void;
//   initialData?: HabitAction | null;
//   handleCloseDrawer: () => void;
// };

// const initialActionState = {
//   task: "",
//   unit: "",
//   metric: "count" as const,
//   type: "build" as const,
//   dailyTarget: 1,
// };

// export function ActionForm({
//   handleActionSubmit,
//   initialData,
//   handleCloseDrawer,
// }: ActionFormProps) {
//   // Use react-hook-form but without a nested form element
//   const form = useForm<Omit<HabitAction, "id" | "value">>({
//     resolver: zodResolver(actionSchema),
//     defaultValues: initialData || initialActionState,
//   });

//   const handleAddAction = useCallback(() => {
//     // Validate all fields using react-hook-form
//     form.handleSubmit((data) => {
//       handleActionSubmit(data);

//       // Reset form if not editing
//       if (!initialData) {
//         form.reset(initialActionState);
//       }

//       // Close drawer
//       handleCloseDrawer();
//     })();
//   }, [form, handleActionSubmit, initialData, handleCloseDrawer]);

//   return (
//     // Use Form component but without the form element
//     <Form {...form}>
//       <div>
//         <ScrollArea className="h-[65vh] p-4">
//           <DrawerHeader>
//             <DrawerTitle className="text-center flex flex-col">
//               {initialData ? "Edit Action" : "Add New Action"}
//               <div className="w-full">
//                 <div className="flex items-center justify-center space-x-4 mt-6">
//                   <ActionIcon
//                     type={form.watch("type")}
//                     dailyTargetCompleted={false}
//                     overCapped={false}
//                     size={30}
//                   />
//                   <ArrowBigRightDash />
//                   <ActionIcon
//                     type={form.watch("type")}
//                     dailyTargetCompleted={true}
//                     overCapped={false}
//                     size={30}
//                   />
//                 </div>
//               </div>
//             </DrawerTitle>
//             <DrawerDescription className="text-center mt-2">
//               {initialData
//                 ? "Edit your habit action details below"
//                 : "Add a new habit action by filling out the details below"}
//             </DrawerDescription>
//           </DrawerHeader>
//           <div className="px-1 pb-4 space-y-4">
//             <FormField
//               control={form.control}
//               name="type"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>I want to...</FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                     value={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select action type" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="build">
//                         <span className="flex items-center">
//                           <ActionIcon type="build" size={20} />
//                           <span className="ml-2">Build a habit</span>
//                         </span>
//                       </SelectItem>
//                       <SelectItem value="break">
//                         <span className="flex items-center">
//                           <ActionIcon type="break" size={20} />
//                           <span className="ml-2">Break a habit</span>
//                         </span>
//                       </SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="task"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>
//                     {form.watch("type") === "build"
//                       ? "I will..."
//                       : "I won't..."}
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       className="text-base"
//                       placeholder="e.g., Do pushups, Read books, Meditate"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormDescription>
//                     Describe the specific action you'll take. Make it clear and
//                     measurable.
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="unit"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Tracking Unit</FormLabel>
//                   <FormControl>
//                     <Input
//                       className="text-base"
//                       placeholder="e.g., repetitions, pages, minutes"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormDescription>
//                     Choose the unit that best measures your action (what you'll
//                     count or track each day)
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="dailyTarget"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="flex items-center mb-6">
//                     Daily {form.watch("type") === "build" ? "Target" : "Limit"}:
//                     <span className="ml-2 space-x-1 text-lg flex items-center">
//                       <MetricIcon metric={form.watch("metric")} size={20} />
//                       <span>{field.value}</span>
//                     </span>
//                   </FormLabel>
//                   <FormControl>
//                     <div className="flex items-center">
//                       <Slider
//                         min={1}
//                         max={10}
//                         step={1}
//                         value={[field.value]}
//                         onValueChange={(value) => field.onChange(value[0])}
//                       />
//                     </div>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//         </ScrollArea>

//         <div className="flex flex-col justify-center items-center my-2 px-4">
//           <Button
//             className="w-full mt-3 mb-4"
//             type="button"
//             onClick={handleAddAction}
//           >
//             {initialData ? "Update Action" : "Add Action"}
//           </Button>
//           <Button
//             type="button"
//             variant="outline"
//             className="w-full"
//             onClick={handleCloseDrawer}
//           >
//             Cancel
//           </Button>
//         </div>
//       </div>
//     </Form>
//   );
// }
