type HabitCardActionTextProps = {
  actionTask: string;
  actionType: "build" | "break";
  actionIcon: JSX.Element;
};

export function HabitCardActionText({
  actionTask,
  actionIcon,
  actionType,
}: HabitCardActionTextProps) {
  return (
    <div className="w-full">
      <span className="mr-2 inline-flex align-middle -mt-[2px]">
        {actionIcon}
      </span>

      <span className="mr-1 font-semibold inline-flex align-baseline">
        {actionType === "build" ? "I will" : "I won't"}
      </span>

      {actionTask}
    </div>
  );
}
