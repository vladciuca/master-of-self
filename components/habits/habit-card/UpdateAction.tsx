// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";

// type ActionUpdatesProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   habit: { name: string }; // Adjust this type according to your Habit type
// };

// export function UpdateAction({ isOpen, onClose, habit }: ActionUpdatesProps) {
//   return (
//     <Drawer open={isOpen} onOpenChange={onClose}>
//       <DrawerContent>
//         <DrawerHeader>
//           <DrawerTitle>Take Action on {habit.name}</DrawerTitle>
//           <DrawerDescription>
//             Update your progress or add notes for this habit.
//           </DrawerDescription>
//         </DrawerHeader>
//         <div className="p-4">
//           {/* Add your action update form or content here */}
//           <p>Action update content for {habit.name} goes here.</p>
//         </div>
//         <DrawerFooter>
//           <Button onClick={onClose}>Submit</Button>
//           <DrawerClose asChild>
//             <Button variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//           </DrawerClose>
//         </DrawerFooter>
//       </DrawerContent>
//     </Drawer>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

type ActionUpdatesProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  habit: { name: string }; // Adjust this type according to your Habit type
};

export function ActionUpdates({
  isOpen,
  onOpenChange,
  habit,
}: ActionUpdatesProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-md mx-auto left-0 right-0">
        <DrawerHeader>
          <DrawerTitle>Take Action on {habit.name}</DrawerTitle>
          <DrawerDescription>
            Update your progress or add notes for this habit.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          {/* Add your action update form or content here */}
          <p>Action update content for {habit.name} goes here.</p>
        </div>
        <DrawerFooter>
          <Button onClick={() => onOpenChange(false)}>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
