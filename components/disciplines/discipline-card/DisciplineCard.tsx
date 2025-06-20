// import React from "react";
// import { useSession } from "next-auth/react";
// import { usePathname } from "next/navigation";
// import { DisciplineCardHeader } from "./DisciplineCardHeader";
// import { DisciplineCardContent } from "./DisciplineCardContent";
// import { DisciplineCardFooter } from "./DisciplineCardFooter";
// import {
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import type { Session, JournalCustomStepConfig } from "@models/types";
// import type { Discipline } from "@models/mongodb";

// type Step = JournalCustomStepConfig | Discipline;

// type DisciplineCardProps = {
//   step: Step;
//   handleEdit: (habit: Discipline) => void;
// };

// function isUserDiscipline(step: Step): step is Discipline {
//   return "creatorId" in step;
// }

// export function DisciplineCard({ step, handleEdit }: DisciplineCardProps) {
//   const { data: session } = useSession() as { data: Session | null };
//   const pathName = usePathname();

//   return (
//     <AccordionItem
//       key={String(step._id)}
//       value={String(step._id)}
//       className="p-0 mb-3 border-transparent"
//     >
//       <AccordionTrigger className="py-2">
//         <div className="flex flex-col w-full">
//           <DisciplineCardHeader
//             disciplineId={String(step._id)}
//             icon={step.icon}
//             discipline={step.discipline}
//             type={step.type}
//             color={"color" in step ? step.color : undefined}
//           />
//           <div>{"chevron icon"}</div>
//         </div>
//       </AccordionTrigger>
//       <AccordionContent>
//         <DisciplineCardContent
//           title={step.title}
//           description={step.description}
//         />
//         {isUserDiscipline(step) && (
//           <DisciplineCardFooter
//             session={session}
//             pathName={pathName}
//             handleEdit={handleEdit}
//             discipline={step}
//           />
//         )}
//       </AccordionContent>
//     </AccordionItem>
//   );
// }
"use client";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { TbChevronCompactDown } from "react-icons/tb";
import { DisciplineCardHeader } from "./DisciplineCardHeader";
import { DisciplineCardContent } from "./DisciplineCardContent";
import { DisciplineCardFooter } from "./DisciplineCardFooter";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Session, JournalCustomStepConfig } from "@models/types";
import type { Discipline } from "@models/mongodb";

type Step = JournalCustomStepConfig | Discipline;

type DisciplineCardProps = {
  step: Step;
  handleEdit: (habit: Discipline) => void;
};

function isUserDiscipline(step: Step): step is Discipline {
  return "creatorId" in step;
}

export function DisciplineCard({ step, handleEdit }: DisciplineCardProps) {
  const { data: session } = useSession() as { data: Session | null };
  const pathName = usePathname();

  return (
    <AccordionItem
      key={String(step._id)}
      value={String(step._id)}
      className="p-0 mb-0 border-transparent"
    >
      <AccordionTrigger className="pt-2 pb-0 [&[data-state=open]>div>div:last-child>svg]:rotate-180">
        <div className="flex flex-col w-full">
          <DisciplineCardHeader
            disciplineId={String(step._id)}
            icon={step.icon}
            discipline={step.discipline}
            type={step.type}
            color={"color" in step ? step.color : undefined}
          />
          <div className="flex justify-center mt-1">
            <TbChevronCompactDown className="h-4 w-8 transition-transform duration-200 ease-in-out" />
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <DisciplineCardContent
          title={step.title}
          description={step.description}
        />
        {isUserDiscipline(step) && (
          <DisciplineCardFooter
            session={session}
            pathName={pathName}
            handleEdit={handleEdit}
            discipline={step}
          />
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
