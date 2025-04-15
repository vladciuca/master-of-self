type DisciplineCardContentProps = {
  title: string;
  description: string;
};

export function DisciplineCardContent({
  title,
  description,
}: DisciplineCardContentProps) {
  return (
    <div className="w-full px-3 mt-2">
      <div className="font-semibold">{title}</div>
      <div className="text-muted-foreground">{description}</div>
    </div>
  );
}
