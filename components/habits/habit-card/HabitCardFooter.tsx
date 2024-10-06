// import { useState } from "react";
// import { UpdateAction } from "./UpdateAction";
// import { Button } from "@components/ui/button";
// import { Session, Habit } from "@app/types/types";

// type HabitCardFooterProps = {
//   session: Session | null;
//   habit: Habit;
//   pathName: string;
//   handleEdit: (habit: Habit) => void;
//   //   handleDelete: (habit: Habit) => Promise<void>;
// };

// export function HabitCardFooter({
//   session,
//   habit,
//   pathName,
//   handleEdit,
// }: HabitCardFooterProps) {
//   const [isActionDrawerOpen, setIsActionDrawerOpen] = useState(false);

//   const handleCloseDrawer = () => {
//     setIsActionDrawerOpen(false);
//   };

//   if (session?.user?.id !== habit.creatorId || pathName !== "/habits") {
//     return null;
//   }

//   return (
//     <>
//       <div className="mt-12 flex justify-between">
//         <Button
//           variant="secondary"
//           onClick={() => handleEdit(habit)}
//           className="mr-3"
//           size="sm"
//         >
//           Edit
//         </Button>
//         {/* <Button variant="ghost" onClick={() => handleDelete(habit)} size="sm">
//         Delete(TEST)
//       </Button> */}
//         <Button size="sm" onClick={() => setIsActionDrawerOpen(true)}>
//           Take Action!
//         </Button>
//       </div>
//       <UpdateAction
//         isOpen={isActionDrawerOpen}
//         onClose={handleCloseDrawer}
//         habit={habit}
//       />
//     </>
//   );
// }

"use client";

import { useState } from "react";
import { Session, Habit } from "@app/types/types";
import { Button } from "@components/ui/button";
import { ActionUpdates } from "./UpdateAction"; // Make sure this path is correct

type HabitCardFooterProps = {
  session: Session | null;
  habit: Habit;
  pathName: string;
  handleEdit: (habit: Habit) => void;
};

export function HabitCardFooter({
  session,
  habit,
  pathName,
  handleEdit,
}: HabitCardFooterProps) {
  const [isActionDrawerOpen, setIsActionDrawerOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsActionDrawerOpen(open);
  };

  if (session?.user?.id !== habit.creatorId || pathName !== "/habits") {
    return null;
  }

  return (
    <>
      <div className="mt-12 flex justify-between">
        <Button
          variant="secondary"
          onClick={() => handleEdit(habit)}
          className="mr-3"
          size="sm"
        >
          Edit
        </Button>
        {/* <Button size="sm" onClick={() => setIsActionDrawerOpen(true)}>
          Take Action!
        </Button> */}
      </div>
      <ActionUpdates
        isOpen={isActionDrawerOpen}
        onOpenChange={handleOpenChange}
        habit={habit}
      />
    </>
  );
}
