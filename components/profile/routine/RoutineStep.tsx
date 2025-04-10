// import React from "react";
// import { Switch } from "@components/ui/switch";
// import { useUserProfile } from "@context/UserProfileContext";
// import { RoutineStepProps } from "@models/types";
// import { stepIconMap } from "@components/ui/constants";

// export function RoutineStep({
//   // icon,
//   title,
//   description,
//   stepKey,
// }: RoutineStepProps) {
//   const { userProfile, userProfileLoading, handleRoutineChange } =
//     useUserProfile();
//   const IconElement = stepIconMap[stepKey] || stepIconMap.default;

//   return (
//     <div className="my-4 flex justify-between items-center">
//       <span className="w-3/12 flex items-center justify-center mr-4">
//         {React.cloneElement(IconElement as React.ReactElement, {
//           size: 40,
//         })}
//       </span>

//       <div className="flex flex-grow">
//         <div>
//           <h1>{title}</h1>
//           <p className="text-sm text-muted-foreground">{description}</p>
//         </div>
//       </div>

//       <span className="w-3/12 flex items-center justify-center">
//         <Switch
//           checked={userProfile.steps[stepKey]}
//           onCheckedChange={() => handleRoutineChange(stepKey)}
//           disabled={userProfileLoading}
//         />
//       </span>
//     </div>
//   );
// }
