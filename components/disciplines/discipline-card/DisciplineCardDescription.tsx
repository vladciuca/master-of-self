type DisciplineCardDescriptionProps = {
  title: string;
  description: string;
  color?: string;
};

export function DisciplineCardDescription({
  title,
  description,
  color,
}: DisciplineCardDescriptionProps) {
  return (
    <div className="w-full px-4 mt-4">
      <div className={`font-semibold text-lg mb-2 text-${color}`}>{title}</div>
      <div className="text-muted-foreground text-sm">{description}</div>
    </div>
  );
}
