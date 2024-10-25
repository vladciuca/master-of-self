import React from "react";
import { Label } from "@components/ui/label";

type FormStepTemplateProps = {
  title: string;
  description?: string;
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
      <div className="space-y-4 text-center mx-2 sm:mx-4">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description && (
          <Label className="text-sm text-muted-foreground">{description}</Label>
        )}
        {scoreSection && (
          <div className="text-4xl flex items-baseline justify-center font-semibold">
            {scoreSection}
          </div>
        )}
      </div>
      <div className="flex-grow overflow-y-auto m-4 mx-8">{children}</div>
    </div>
  );
}
