type HabitCardActionTextProps = {
  actionName: string;
  actionType: "build" | "break";
  actionIcon: JSX.Element;
};

export function HabitCardActionText({
  actionName,
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

      {actionName}
    </div>
  );
}
