import { DisciplineSectionDelimiter } from "@components/disciplines/DisciplineSectionDelimiter";
import { DisciplineCard } from "@components/disciplines/discipline-card/DisciplineCard";
import { DisciplineCardDescription } from "@components/disciplines/discipline-card/DisciplineCardDescription";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { customStepConfigs } from "@components/journal/journal-entry-form/form-steps/steps/CustomSteps";
import { Discipline } from "@models/mongodb";

export function DisciplinesList({
  userDisciplines,
}: {
  userDisciplines: Discipline[];
}) {
  console.log("==========userDisciplines", userDisciplines);

  const mergedDisciplines = [...customStepConfigs, ...userDisciplines];

  console.log("=====customStepConfigs", customStepConfigs);
  console.log("=====userDisciplines", userDisciplines);

  return (
    <Accordion type="single" collapsible className="mt-4">
      <AccordionItem
        key={"motivation"}
        value={"motivation"}
        className="p-0 px-2"
      >
        <AccordionTrigger className="pt-5 pb-3">
          <DisciplineCard discipline="motivation" />
        </AccordionTrigger>
        <AccordionContent>
          <DisciplineCardDescription
            title={"title"}
            description={"description"}
          />
        </AccordionContent>
      </AccordionItem>

      <DisciplineSectionDelimiter day={true} activeSteps={0} maxSteps={2} />

      {mergedDisciplines
        .filter((step) => step.type === "dayEntry")
        .map((step) => {
          return (
            <AccordionItem
              key={step.discipline}
              value={step.discipline}
              className="p-0 px-2 mb-3"
            >
              <AccordionTrigger className="pt-5 pb-3">
                <DisciplineCard
                  icon={step.icon}
                  discipline={step.discipline}
                  type={step.type}
                />
              </AccordionTrigger>
              <AccordionContent>
                <DisciplineCardDescription
                  title={step.title}
                  description={step.description}
                />
              </AccordionContent>
            </AccordionItem>
          );
        })}

      <DisciplineSectionDelimiter day={false} activeSteps={0} maxSteps={2} />

      {mergedDisciplines
        .filter((step) => step.type === "nightEntry")
        .map((step) => {
          return (
            <AccordionItem
              key={step.discipline}
              value={step.discipline}
              className="p-0 px-2 mb-3"
            >
              <AccordionTrigger className="pt-5 pb-3">
                <DisciplineCard
                  icon={step.icon}
                  discipline={step.discipline}
                  type={step.type}
                />
              </AccordionTrigger>
              <AccordionContent>
                <DisciplineCardDescription
                  title={step.title}
                  description={step.description}
                />
              </AccordionContent>
            </AccordionItem>
          );
        })}
    </Accordion>
  );
}

//===================
// import React from "react";
// import { IconRenderer } from "@components/IconRenderer";

// export function DisciplinesList({
//   userDisciplines,
// }: {
//   userDisciplines: Discipline[];
// }) {
//   console.log("==========userDisciplines", userDisciplines);

//   // Create a map of existing customStepConfigs by discipline
//   type StepConfigMap = {
//     [key: string]: (typeof customStepConfigs)[0];
//   };

//   const stepConfigsMap = customStepConfigs.reduce<StepConfigMap>(
//     (map, config) => {
//       map[config.discipline] = config;
//       return map;
//     },
//     {}
//   );

//   // Merge the two arrays, handling the icon properly
//   const mergedDisciplines = customStepConfigs.map((config) => {
//     const userDiscipline = userDisciplines.find(
//       (d) => d.discipline === config.discipline
//     );

//     if (!userDiscipline) return config;

//     // Keep the original properties and override with user data
//     return {
//       ...config,
//       ...userDiscipline,
//       // Keep the React element icon from config
//       icon: config.icon,
//     };
//   });

//   // Add any user disciplines that don't exist in customStepConfigs
//   const userOnlyDisciplines = userDisciplines.filter(
//     (d) => !stepConfigsMap[d.discipline]
//   );

//   const allDisciplines = [...mergedDisciplines, ...userOnlyDisciplines];

//   // Get day and night entries separately
//   const dayEntries = allDisciplines.filter((step) => step.type === "dayEntry");
//   const nightEntries = allDisciplines.filter(
//     (step) => step.type === "nightEntry"
//   );
//   const otherEntries = allDisciplines.filter(
//     (step) => step.type !== "dayEntry" && step.type !== "nightEntry"
//   );

//   // Helper function to render the icon
//   const renderIcon = (step: any) => {
//     // If it's a React element (from customStepConfigs)
//     if (React.isValidElement(step.icon)) {
//       return step.icon;
//     }

//     // If it's a string (from userDisciplines)
//     if (typeof step.icon === "string") {
//       return <IconRenderer iconName={step.icon} />;
//     }

//     // Default fallback
//     return null;
//   };

//   return (
//     <Accordion type="single" collapsible className="mt-4">
//       <AccordionItem
//         key={"motivation"}
//         value={"motivation"}
//         className="p-0 px-2"
//       >
//         <AccordionTrigger className="pt-5 pb-3">
//           <DisciplineCard discipline="motivation" />
//         </AccordionTrigger>
//         <AccordionContent>
//           <DisciplineCardDescription
//             title={"title"}
//             description={"description"}
//           />
//         </AccordionContent>
//       </AccordionItem>

//       {otherEntries.length > 0 &&
//         otherEntries.map((step) => (
//           <AccordionItem
//             key={step.discipline}
//             value={step.discipline}
//             className="p-0 px-2 mb-3"
//           >
//             <AccordionTrigger className="pt-5 pb-3">
//               <DisciplineCard
//                 icon={renderIcon(step)}
//                 discipline={step.discipline}
//                 type={step.type}
//               />
//             </AccordionTrigger>
//             <AccordionContent>
//               <DisciplineCardDescription
//                 title={step.title || step.discipline}
//                 description={step.description || ""}
//               />
//             </AccordionContent>
//           </AccordionItem>
//         ))}

//       {dayEntries.length > 0 && (
//         <>
//           <DisciplineSectionDelimiter
//             day={true}
//             activeSteps={0}
//             maxSteps={dayEntries.length}
//           />

//           {dayEntries.map((step) => (
//             <AccordionItem
//               key={step.discipline}
//               value={step.discipline}
//               className="p-0 px-2 mb-3"
//             >
//               <AccordionTrigger className="pt-5 pb-3">
//                 <DisciplineCard
//                   icon={renderIcon(step)}
//                   discipline={step.discipline}
//                   type={step.type}
//                 />
//               </AccordionTrigger>
//               <AccordionContent>
//                 <DisciplineCardDescription
//                   title={step.title || step.discipline}
//                   description={step.description || ""}
//                 />
//               </AccordionContent>
//             </AccordionItem>
//           ))}
//         </>
//       )}

//       {nightEntries.length > 0 && (
//         <>
//           <DisciplineSectionDelimiter
//             day={false}
//             activeSteps={0}
//             maxSteps={nightEntries.length}
//           />

//           {nightEntries.map((step) => (
//             <AccordionItem
//               key={step.discipline}
//               value={step.discipline}
//               className="p-0 px-2 mb-3"
//             >
//               <AccordionTrigger className="pt-5 pb-3">
//                 <DisciplineCard
//                   icon={renderIcon(step)}
//                   discipline={step.discipline}
//                   type={step.type}
//                 />
//               </AccordionTrigger>
//               <AccordionContent>
//                 <DisciplineCardDescription
//                   title={step.title || step.discipline}
//                   description={step.description || ""}
//                 />
//               </AccordionContent>
//             </AccordionItem>
//           ))}
//         </>
//       )}
//     </Accordion>
//   );
// }
