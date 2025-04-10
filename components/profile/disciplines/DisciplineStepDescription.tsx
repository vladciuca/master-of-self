type DisciplineStepDescriptionProps = {
  title: string;
  description: string;
};

export function DisciplineStepDescription({
  title,
  description,
}: DisciplineStepDescriptionProps) {
  return (
    <div className="w-full px-4 mt-4">
      <div className="font-semibold text-md mb-2">{title}</div>
      <div className="text-muted-foreground text-sm">{description}</div>
    </div>
  );
}
