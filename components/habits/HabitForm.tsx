// "use client";

// import * as z from "zod";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Link from "next/link";
// import { IconPicker } from "@components/IconPicker";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@components/ui/form";
// import { Input } from "@components/ui/input";
// import { Button } from "@components/ui/button";
// import { Textarea } from "@components/ui/textarea";
// import { useIconRarityLevel } from "@hooks/useIconRarityLevel";
// import { CircleAlert, CircleX } from "lucide-react";

// const formSchema = z.object({
//   name: z
//     .string()
//     .min(3, "Habit name must contain at least 3 characters")
//     .max(25, "Habit name must contain maximum 25 characters"),
//   icon: z.string().min(1, "Please select an icon"),
//   description: z.string().min(3, "Please add a habit description"),
//   xp: z.number().optional(),
//   // actions: z.array(z.string()).min(1, "Please add a habit action"),
//   actions: z
//     .array(
//       z.object({
//         action: z.string(),
//         metric: z.enum(["count", "time"]),
//         value: z.union([z.string(), z.number()]),
//         actionData: z.array(
//           z.tuple([z.date(), z.union([z.string(), z.number()])])
//         ),
//       })
//     )
//     .min(1, "Please add a habit action"),
// });

// export type HabitZodType = z.infer<typeof formSchema>;

// type HabitFormProps = {
//   type: "Update" | "Create";
//   submitting: boolean;
//   onSubmit: (habit: HabitZodType) => Promise<void>;
//   habit?: HabitZodType;
// };

// export function HabitForm({
//   type,
//   submitting,
//   onSubmit,
//   habit,
// }: HabitFormProps) {
//   const [newAction, setNewAction] = useState({
//     action: "",
//     metric: "count",
//     value: "",
//   });

//   const form = useForm<HabitZodType>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: type === "Update" ? habit?.name : "",
//       icon: type === "Update" ? habit?.icon : "",
//       description: type === "Update" ? habit?.description : "",
//       xp: type === "Update" ? habit?.xp : 0,
//       actions: type === "Update" ? habit?.actions || [] : [],
//     },
//   });

//   const { iconColorClass, bgColorClass } = useIconRarityLevel(form.watch("xp"));

//   const addAction = () => {
//     if (newAction.action !== "") {
//       const currentActions = form.watch("actions");
//       form.setValue("actions", [
//         ...currentActions,
//         { ...newAction, actionData: [] },
//       ]);
//       setNewAction({ action: "", metric: "count", value: "" });
//     }
//   };

//   const removeAction = (index: number) => {
//     const updatedActions = form.watch("actions").filter((_, i) => i !== index);
//     form.setValue("actions", updatedActions);
//   };

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="flex flex-col space-y-8 h-full justify-between"
//       >
//         <h1 className="scroll-m-20 text-4xl font-bold tracking-tight mb-4">
//           {type} Habit
//         </h1>

//         <FormField
//           control={form.control}
//           name="icon"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Habit Icon</FormLabel>
//               <FormControl>
//                 <IconPicker
//                   value={field.value}
//                   onChange={(iconName) => field.onChange(iconName)}
//                   iconColorClass={iconColorClass}
//                   bgColorClass={bgColorClass}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="name"
//           render={({ field }) => {
//             return (
//               <FormItem>
//                 <FormLabel>Habit name</FormLabel>
//                 <FormControl>
//                   <Input
//                     className="text-base"
//                     placeholder="A consistent action you can take to improve..."
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             );
//           }}
//         />

//         <FormField
//           control={form.control}
//           name="description"
//           render={({ field }) => {
//             return (
//               <FormItem>
//                 <FormLabel>Habit description</FormLabel>
//                 <FormControl>
//                   <Textarea
//                     className="text-base"
//                     placeholder="How can this action help you achieve your goals?"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             );
//           }}
//         />

//         {/* <FormField
//           control={form.control}
//           name="actions"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Actions</FormLabel>
//               <div className="flex flex-col gap-2">
//                 {field.value.map((action, index) => (
//                   <div
//                     key={index}
//                     className="text flex justify-between items-center border-b pb-1 mb-2"
//                   >
//                     <div className="flex items-center">
//                       <CircleAlert size={20} className="mr-2" />
//                       {action}
//                     </div>

//                     <button
//                       type="button"
//                       onClick={() => removeAction(index)}
//                       className="ml-2 text-red-500"
//                     >
//                       <CircleX size={20} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//               <FormControl>
//                 <div className="flex">
//                   <Input
//                     value={newAction}
//                     onChange={(e) => setNewAction(e.target.value)}
//                     placeholder="Add a action"
//                     onKeyPress={(e) => {
//                       if (e.key === "Enter") {
//                         e.preventDefault();
//                         addAction();
//                       }
//                     }}
//                   />
//                   <Button
//                     type="button"
//                     onClick={addAction}
//                     className="ml-4 text-sm"
//                   >
//                     Add Action
//                   </Button>
//                 </div>
//               </FormControl>

//               <FormMessage />
//             </FormItem>
//           )}
//         /> */}

//         <FormField
//           control={form.control}
//           name="actions"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Actions</FormLabel>
//               <div className="flex flex-col gap-2">
//                 {field.value.map((action, index) => (
//                   <div
//                     key={index}
//                     className="text flex justify-between items-center border-b pb-1 mb-2"
//                   >
//                     <div className="flex items-center">
//                       <CircleAlert size={20} className="mr-2" />
//                       {action.action} - {action.metric} - {action.value}
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => removeAction(index)}
//                       className="ml-2 text-red-500"
//                     >
//                       <CircleX size={20} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//               <FormControl>
//                 <div className="flex flex-col gap-2">
//                   <Input
//                     value={newAction.action}
//                     onChange={(e) =>
//                       setNewAction({ ...newAction, action: e.target.value })
//                     }
//                     placeholder="Add an action"
//                   />
//                   <select
//                     value={newAction.metric}
//                     onChange={(e) =>
//                       setNewAction({
//                         ...newAction,
//                         metric: e.target.value as "count" | "time",
//                       })
//                     }
//                   >
//                     <option value="count">Count</option>
//                     <option value="time">Time</option>
//                   </select>
//                   <Input
//                     value={newAction.value}
//                     onChange={(e) =>
//                       setNewAction({ ...newAction, value: e.target.value })
//                     }
//                     placeholder={
//                       newAction.metric === "count"
//                         ? "Enter count"
//                         : "Enter time (e.g., 30m)"
//                     }
//                   />
//                   <Button type="button" onClick={addAction} className="mt-2">
//                     Add Action
//                   </Button>
//                 </div>
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <div className="flex flex-col justify-center items-center flex-grow">
//           <Button type="submit" disabled={submitting} className="w-1/2 mt-3">
//             {type} Habit
//           </Button>
//           <Link href="/habits" className="w-full flex justify-center my-8">
//             <Button variant="secondary" className="w-1/2">
//               Cancel
//             </Button>
//           </Link>
//         </div>
//       </form>
//     </Form>
//   );
// }

"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { IconPicker } from "@/components/IconPicker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useIconRarityLevel } from "@/hooks/useIconRarityLevel";
import {
  CircleX,
  Plus,
  CircleAlert,
  TriangleAlert,
  OctagonAlert,
  ShieldAlert,
  Hash,
  Clock,
} from "lucide-react";

const formSchema = z.object({
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
        type: z.enum(["offensive", "defensive", "balanced"]),
        metric: z.enum(["count", "time"]),
        value: z.number().default(0),
      })
    )
    .min(1, "Please add a habit action"),
});

export type HabitZodType = z.infer<typeof formSchema>;

type HabitFormProps = {
  type: "Update" | "Create";
  submitting: boolean;
  onSubmit: (habit: HabitZodType) => Promise<void>;
  habit?: HabitZodType;
};

export function HabitForm({
  type,
  submitting,
  onSubmit,
  habit,
}: HabitFormProps) {
  const [newAction, setNewAction] = useState<{
    action: string;
    metric: "count" | "time";
    type: "offensive" | "defensive" | "balanced";
  }>({
    action: "",
    metric: "count",
    type: "balanced",
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const form = useForm<HabitZodType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: type === "Update" ? habit?.name : "",
      icon: type === "Update" ? habit?.icon : "",
      description: type === "Update" ? habit?.description : "",
      xp: type === "Update" ? habit?.xp : 0,
      actions: type === "Update" ? habit?.actions || [] : [],
    },
  });

  const { iconColorClass, bgColorClass } = useIconRarityLevel(form.watch("xp"));

  const addAction = () => {
    if (newAction.action !== "") {
      const currentActions = form.watch("actions");
      form.setValue("actions", [...currentActions, { ...newAction, value: 0 }]);
      setNewAction({ action: "", metric: "count", type: "balanced" });
      setIsDrawerOpen(false);
    }
  };

  const removeAction = (index: number) => {
    const updatedActions = form.watch("actions").filter((_, i) => i !== index);
    form.setValue("actions", updatedActions);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-8 h-full justify-between"
      >
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight mb-4">
          {type} Habit
        </h1>

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Habit Icon</FormLabel>
              <FormControl>
                <IconPicker
                  value={field.value}
                  onChange={(iconName) => field.onChange(iconName)}
                  iconColorClass={iconColorClass}
                  bgColorClass={bgColorClass}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Habit name</FormLabel>
              <FormControl>
                <Input
                  className="text-base"
                  placeholder="A consistent action you can take to improve..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Habit description</FormLabel>
              <FormControl>
                <Textarea
                  className="text-base"
                  placeholder="How can this action help you achieve your goals?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="actions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Actions</FormLabel>
              {/* <div className="flex flex-col gap-2">
                {field.value.map((action, index) => (
                  <div
                    key={index}
                    className="text flex justify-between items-center border-b pb-1 mb-2"
                  >
                    <div className="flex items-center">
                      <CircleAlert size={20} className="mr-2" />
                      {action}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAction(index)}
                      className="ml-2 text-red-500"
                      aria-label={`Remove action ${action}`}
                    >
                      <CircleX size={20} />
                    </button>
                  </div>
                ))}
              </div> */}
              {/* <div className="flex flex-col gap-2">
                {field.value.map((action, index) => (
                  <div
                    key={index}
                    className="text flex justify-between items-center border-b pb-1 mb-2"
                  >
                    <div className="flex items-center">
                      <CircleAlert size={20} className="mr-2" />
                      {action.action} - {action.metric}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAction(index)}
                      className="ml-2 text-red-500"
                      aria-label={`Remove action ${action.action}`}
                    >
                      <CircleX size={20} />
                    </button>
                  </div>
                ))}
              </div> */}
              <div className="flex flex-col gap-4">
                {field.value.map((action, index) => (
                  <div key={index} className="border p-4 rounded-md">
                    <div className="text flex justify-between items-center border-b pb-1 mb-2">
                      <div className="flex items-center">
                        {/* CHANGE: Added icon based on action type */}
                        {action.type === "offensive" ? (
                          <TriangleAlert
                            className="mr-2 text-blue-500"
                            size={20}
                          />
                        ) : action.type === "defensive" ? (
                          <OctagonAlert
                            className="mr-2 text-blue-500"
                            size={20}
                          />
                        ) : (
                          <CircleAlert
                            className="mr-2 text-blue-500"
                            size={20}
                          />
                        )}
                        {action.action} - {action.metric}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAction(index)}
                        className="ml-2 text-red-500"
                        aria-label={`Remove action ${action.action}`}
                      >
                        <CircleX size={20} />
                      </button>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Badge variant="secondary" className="capitalize">
                        {action.type}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {action.metric === "count" ? (
                          <Hash size={18} className="mr-2" />
                        ) : (
                          <Clock size={18} className="mr-2" />
                        )}
                        {action.metric}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mt-2"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Action
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="max-w-md mx-auto left-0 right-0">
                  <DrawerHeader>
                    <DrawerTitle>Add New Action</DrawerTitle>
                  </DrawerHeader>
                  {/* <div className="p-4 pb-0">
                    <FormControl>
                      <Input
                        value={newAction}
                        onChange={(e) => setNewAction(e.target.value)}
                        placeholder="Enter new action"
                        className="mb-4"
                      />
                    </FormControl>
                    <Button onClick={addAction} className="w-full mb-4">
                      Add Action
                    </Button>
                  </div> */}
                  <div className="p-4 pb-0">
                    <FormControl>
                      <Input
                        value={newAction.action}
                        onChange={(e) =>
                          setNewAction({ ...newAction, action: e.target.value })
                        }
                        placeholder="Enter new action"
                        className="mb-4"
                      />
                    </FormControl>
                    {/* CHANGE: Added Select for metric */}
                    <Select
                      value={newAction.metric}
                      onValueChange={(value: "count" | "time") =>
                        setNewAction({ ...newAction, metric: value })
                      }
                    >
                      <SelectTrigger className="mb-4">
                        <SelectValue placeholder="Select metric" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="count">Count</SelectItem>
                        <SelectItem value="time">Time</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={newAction.type}
                      onValueChange={(
                        value: "offensive" | "defensive" | "balanced"
                      ) => setNewAction({ ...newAction, type: value })}
                    >
                      <SelectTrigger className="mb-4">
                        <SelectValue placeholder="Select action type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="offensive">Offensive</SelectItem>
                        <SelectItem value="defensive">Defensive</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={addAction} className="w-full mb-4">
                      Add Action
                    </Button>
                  </div>
                </DrawerContent>
              </Drawer>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col justify-center items-center flex-grow">
          <Button type="submit" disabled={submitting} className="w-1/2 mt-3">
            {type} Habit
          </Button>
          <Link href="/habits" className="w-full flex justify-center my-8">
            <Button variant="secondary" className="w-1/2">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </Form>
  );
}
