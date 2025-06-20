type DisciplineCardContentProps = {
  title?: string;
  description: string;
};

export function DisciplineCardContent({
  title,
  description,
}: DisciplineCardContentProps) {
  return (
    <div className="w-full px-2 mt-2">
      {title && <div className="font-semibold text-lg">{title}</div>}
      <div className="text-muted-foreground">{description}</div>
    </div>
  );
}
