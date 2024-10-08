// import React, { useState, useCallback } from "react";
// import {
//   Drawer,
//   DrawerContent,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
//   DrawerFooter,
//   DrawerClose,
// } from "@/components/ui/drawer";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@components/ui/scroll-area";
// import { HabitAction } from "@components/journal/journal-entry-form/form-steps/habit-actions-step/HabitAction/HabitAction";
// import { HabitProgressBar } from "./HabitProgressBar";
// import { Habit, HabitActionUpdate } from "@app/types/mongodb";
// import { updateJournalEntry } from "@/lib/api/journal-entries";

// interface HabitActionsDrawerProps {
//   habit: Habit;
//   journalEntryId: string;
//   initialActionValues: { [key: string]: number };
//   onActionChange: (habitId: string, actionId: string, newValue: number) => void;
// }

// export function HabitActionsDrawer({
//   habit,
//   journalEntryId,
//   initialActionValues,
//   onActionChange,
// }: HabitActionsDrawerProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [actionValues, setActionValues] = useState<{ [key: string]: number }>(
//     initialActionValues
//   );

//   const handleActionChange = useCallback(
//     (actionId: string, newValue: number) => {
//       setActionValues((prev) => {
//         const updatedValues = { ...prev, [actionId]: newValue };
//         onActionChange(habit._id, actionId, newValue);
//         return updatedValues;
//       });
//     },
//     [habit._id, onActionChange]
//   );

//   const handleSave = useCallback(async () => {
//     const update: HabitActionUpdate = {
//       [habit._id]: actionValues,
//     };

//     try {
//       await updateJournalEntry(journalEntryId, {
//         nightEntry: { actions: update },
//       });
//       setIsOpen(false);
//     } catch (error) {
//       console.error("Failed to update journal entry:", error);
//     }
//   }, [habit._id, actionValues, journalEntryId]);

//   const calculateProjectedXP = useCallback(() => {
//     return Object.values(actionValues).reduce((sum, value) => sum + value, 0);
//   }, [actionValues]);

//   return (
//     <Drawer open={isOpen} onOpenChange={setIsOpen}>
//       <DrawerTrigger asChild>
//         <Button variant="outline" size="sm">
//           Update Actions
//         </Button>
//       </DrawerTrigger>
//       <DrawerContent>
//         <DrawerHeader>
//           <DrawerTitle>{habit.name} Actions</DrawerTitle>
//           <HabitProgressBar
//             icon={habit.icon}
//             xp={habit.xp}
//             currentProgressPercentage={0} // You'll need to calculate this
//             xpGainProgressPercentage={0} // You'll need to calculate this
//           />
//           <div>Projected XP Gain: {calculateProjectedXP()}</div>
//         </DrawerHeader>
//         <ScrollArea className="h-[50vh] p-4">
//           {habit.actions.map((action) => (
//             <HabitAction
//               key={action.id}
//               action={action}
//               value={actionValues[action.id] || 0}
//               onValueChange={(newValue) =>
//                 handleActionChange(action.id, newValue)
//               }
//             />
//           ))}
//         </ScrollArea>
//         <DrawerFooter>
//           <Button onClick={handleSave}>Save Changes</Button>
//           <DrawerClose asChild>
//             <Button variant="outline">Cancel</Button>
//           </DrawerClose>
//         </DrawerFooter>
//       </DrawerContent>
//     </Drawer>
//   );
// }
