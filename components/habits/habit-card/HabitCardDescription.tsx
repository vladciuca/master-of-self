type HabitCardDescriptionProps = {
  description: string;
};

export function HabitCardDescription({
  description,
}: HabitCardDescriptionProps) {
  return (
    <div className="my-4 mb-6">
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
