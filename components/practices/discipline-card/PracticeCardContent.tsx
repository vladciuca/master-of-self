type PracticeCardContentProps = {
  title?: string;
  description: string;
};

export function PracticeCardContent({
  title,
  description,
}: PracticeCardContentProps) {
  return (
    <div className="w-full px-2 mt-2">
      {title && <div className="font-semibold text-lg">{title}</div>}
      <div className="text-muted-foreground">{description}</div>
    </div>
  );
}
