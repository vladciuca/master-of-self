import React, { ReactElement } from "react";

interface EntrySectionProps {
  icon: ReactElement;
  title: string;
  items?: string[];
}

const JournalEntrySection = ({ icon, title, items }: EntrySectionProps) => {
  return (
    <div className="mt-4">
      <div className="flex items-center mt-4">
        {React.cloneElement(icon, { className: "mr-2 text-muted-foreground" })}
        <div className="text-sm text-muted-foreground">{title}</div>
      </div>
      {items && items.length > 0 && (
        <ol className="mt-2 ml-4 list-disc">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default JournalEntrySection;
