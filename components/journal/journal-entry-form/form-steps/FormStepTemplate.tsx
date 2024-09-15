import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@components/ui/label";

type FormStepTemplateProps = {
  title: string;
  description: string;
  scoreSection?: React.ReactNode;
  children: React.ReactNode;
};

export function FormStepTemplate({
  title,
  description,
  scoreSection,
  children,
}: FormStepTemplateProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 space-y-4 text-center">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description && (
          <Label className="text-sm text-muted-foreground">{description}</Label>
        )}
        {scoreSection}
      </div>
      <ScrollArea className="flex-grow">
        <div className="p-4 h-full">{children}</div>
      </ScrollArea>
    </div>
  );
}
