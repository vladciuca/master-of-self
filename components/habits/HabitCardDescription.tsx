type HabitCardDescriptionProps = {
  description: string;
};

export function HabitCardDescription({
  description,
}: HabitCardDescriptionProps) {
  return (
    <div className="my-4">
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
