// import React, { useState, useEffect } from "react";
// import { Button } from "@components/ui/button";
// import { Input } from "@components/ui/input";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@components/ui/drawer";
// import { ScrollArea } from "@components/ui/scroll-area";
// import { Skeleton } from "@components/ui/skeleton";
// import { CircleHelp } from "lucide-react";
// import * as GiIcons from "react-icons/gi";
// import { useIconPickerSearch } from "@hooks/useIconPickerSearch";

// type IconPickerProps = {
//   value?: string;
//   onChange?: (iconName: string) => void;
//   iconColorClass?: string;
//   bgColorClass?: string;
// };

// export function IconPicker({
//   value,
//   onChange,
//   iconColorClass,
//   bgColorClass,
// }: IconPickerProps) {
//   const {
//     searchTerm,
//     setSearchTerm,
//     selectedIconName,
//     setSelectedIconName,
//     filteredIcons,
//     isSearching,
//   } = useIconPickerSearch(value);

//   const [isLoading, setIsLoading] = useState(true);
//   const [isOpen, setIsOpen] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       const timer = setTimeout(() => {
//         setIsLoading(false);
//       }, 1000); // Simulating a 1-second load time
//       return () => clearTimeout(timer);
//     }
//   }, [isOpen]);

//   const handleSelectIcon = (iconName: string) => {
//     setSelectedIconName(iconName);
//     if (onChange) {
//       onChange(iconName);
//     }
//   };

//   const SelectedIcon = selectedIconName
//     ? GiIcons[selectedIconName as keyof typeof GiIcons]
//     : null;

//   return (
//     <Drawer
//       open={isOpen}
//       onOpenChange={(open) => {
//         setIsOpen(open);
//         if (open) setIsLoading(true);
//       }}
//     >
//       <DrawerTrigger asChild>
//         <div className="w-full">
//           {SelectedIcon ? (
//             <SelectedIcon
//               className={`h-16 w-16 rounded-md ${bgColorClass} ${iconColorClass}`}
//             />
//           ) : (
//             <CircleHelp className="h-8 w-8 mx-5" />
//           )}
//         </div>
//       </DrawerTrigger>
//       <DrawerContent className="max-w-md mx-auto left-0 right-0">
//         <DrawerHeader>
//           <DrawerTitle className="flex flex-col items-center">
//             {selectedIconName ? "Icon Selected" : "Select Icon"}
//             {SelectedIcon ? (
//               <SelectedIcon className="h-16 w-16 my-4" />
//             ) : (
//               <CircleHelp className="h-12 w-12 my-4" />
//             )}
//           </DrawerTitle>
//           <DrawerDescription className="w-full text-center">
//             Choose an icon that best resembles your action.
//           </DrawerDescription>
//         </DrawerHeader>
//         <div className="p-4 pb-0">
//           <Input
//             className="text-base"
//             type="search"
//             placeholder="Search icons..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <ScrollArea className="h-[40vh] p-4">
//           <div className="grid grid-cols-6 gap-2 place-items-center">
//             {isLoading || isSearching
//               ? Array.from({ length: 30 }).map((_, index) => (
//                   <Skeleton key={index} className="h-12 w-12" />
//                 ))
//               : filteredIcons.map(({ name, icon: Icon }) => (
//                   <Button
//                     key={name}
//                     variant="outline"
//                     className="h-12 w-12 p-0"
//                     onClick={() => handleSelectIcon(name)}
//                   >
//                     <Icon className="h-8 w-8" />
//                   </Button>
//                 ))}
//           </div>
//         </ScrollArea>
//         <DrawerFooter>
//           <DrawerClose asChild>
//             <Button variant="default">Done</Button>
//           </DrawerClose>
//         </DrawerFooter>
//       </DrawerContent>
//     </Drawer>
//   );
// }

// import React, { useState, useEffect } from "react";
// import { Button } from "@components/ui/button";
// import { Input } from "@components/ui/input";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@components/ui/drawer";
// import { Skeleton } from "@components/ui/skeleton";
// import { CircleHelp } from "lucide-react";
// import * as GiIcons from "react-icons/gi";
// import { useIconPickerSearch } from "@hooks/useIconPickerSearch";

// type IconPickerProps = {
//   value?: string;
//   onChange?: (iconName: string) => void;
//   iconColorClass?: string;
//   bgColorClass?: string;
// };

// export function IconPicker({
//   value,
//   onChange,
//   iconColorClass,
//   bgColorClass,
// }: IconPickerProps) {
//   const {
//     searchTerm,
//     setSearchTerm,
//     selectedIconName,
//     setSelectedIconName,
//     filteredIcons,
//     isSearching,
//   } = useIconPickerSearch(value);

//   const [isLoading, setIsLoading] = useState(true);
//   const [isOpen, setIsOpen] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       const timer = setTimeout(() => {
//         setIsLoading(false);
//       }, 1000); // Simulating a 1-second load time
//       return () => clearTimeout(timer);
//     }
//   }, [isOpen]);

//   const handleSelectIcon = (iconName: string) => {
//     setSelectedIconName(iconName);
//     if (onChange) {
//       onChange(iconName);
//     }
//   };

//   const SelectedIcon = selectedIconName
//     ? GiIcons[selectedIconName as keyof typeof GiIcons]
//     : null;

//   return (
//     <Drawer
//       open={isOpen}
//       onOpenChange={(open) => {
//         setIsOpen(open);
//         if (open) setIsLoading(true);
//       }}
//     >
//       <DrawerTrigger asChild>
//         <div className="w-full">
//           {SelectedIcon ? (
//             <SelectedIcon
//               className={`h-16 w-16 rounded-md ${bgColorClass} ${iconColorClass}`}
//             />
//           ) : (
//             <CircleHelp className="h-8 w-8 mx-5" />
//           )}
//         </div>
//       </DrawerTrigger>
//       <DrawerContent className="flex flex-col h-[85vh] max-w-md mx-auto left-0 right-0">
//         <DrawerHeader>
//           <DrawerTitle className="flex flex-col items-center">
//             {selectedIconName ? "Icon Selected" : "Select Icon"}
//             {SelectedIcon ? (
//               <SelectedIcon className="h-16 w-16 my-4" />
//             ) : (
//               <CircleHelp className="h-12 w-12 my-4" />
//             )}
//           </DrawerTitle>
//           <DrawerDescription className="w-full text-center">
//             Choose an icon that best resembles your action.
//           </DrawerDescription>
//         </DrawerHeader>
//         <div className="p-4 pb-0">
//           <Input
//             className="text-base"
//             type="search"
//             placeholder="Search icons..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <div className="flex-grow overflow-y-auto p-4">
//           <div className="grid grid-cols-6 gap-2 place-items-center">
//             {isLoading || isSearching
//               ? Array.from({ length: 30 }).map((_, index) => (
//                   <Skeleton key={index} className="h-12 w-12" />
//                 ))
//               : filteredIcons.map(({ name, icon: Icon }) => (
//                   <Button
//                     key={name}
//                     variant="outline"
//                     className="h-12 w-12 p-0"
//                     onClick={() => handleSelectIcon(name)}
//                   >
//                     <Icon className="h-8 w-8" />
//                   </Button>
//                 ))}
//           </div>
//         </div>
//         <DrawerFooter>
//           <DrawerClose asChild>
//             <Button variant="default">Done</Button>
//           </DrawerClose>
//         </DrawerFooter>
//       </DrawerContent>
//     </Drawer>
//   );
// }

import React, { useState, useLayoutEffect } from "react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@components/ui/drawer";
import { Skeleton } from "@components/ui/skeleton";
import { CircleHelp, SearchX } from "lucide-react";
import * as GiIcons from "react-icons/gi";
import { useIconPickerSearch } from "@hooks/useIconPickerSearch";
import { ScrollArea } from "./ui/scroll-area";

type IconPickerProps = {
  value?: string;
  onChange?: (iconName: string) => void;
  iconColorClass?: string;
  bgColorClass?: string;
};

export function IconPicker({
  value,
  onChange,
  iconColorClass,
  bgColorClass,
}: IconPickerProps) {
  const {
    searchTerm,
    setSearchTerm,
    selectedIconName,
    setSelectedIconName,
    filteredIcons,
    isSearching,
  } = useIconPickerSearch(value);

  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useLayoutEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        // Icons should be rendered by now
        setIsLoading(false);
      });
    }
  }, [isOpen]);

  const handleSelectIcon = (iconName: string) => {
    setSelectedIconName(iconName);
    if (onChange) {
      onChange(iconName);
    }
  };

  const SelectedIcon = selectedIconName
    ? GiIcons[selectedIconName as keyof typeof GiIcons]
    : null;

  const renderContent = () => {
    if (isLoading || isSearching) {
      return Array.from({ length: 30 }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-12" />
      ));
    } else if (filteredIcons.length === 0) {
      return (
        <div className="col-span-6 flex flex-col items-center justify-center py-8">
          <SearchX className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-center text-gray-500">
            No icons found for "{searchTerm}".
            <br />
            Try a different search term.
          </p>
        </div>
      );
    } else {
      return filteredIcons.map(({ name, icon: Icon }) => (
        <Button
          key={name}
          variant="outline"
          className="h-12 w-12 p-0"
          onClick={() => handleSelectIcon(name)}
        >
          <Icon className="h-8 w-8" />
        </Button>
      ));
    }
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) setIsLoading(true);
      }}
    >
      <DrawerTrigger asChild>
        <div className="w-full">
          {SelectedIcon ? (
            <SelectedIcon
              className={`h-16 w-16 rounded-md ${bgColorClass} ${iconColorClass}`}
            />
          ) : (
            <CircleHelp className="h-8 w-8 mx-5" />
          )}
        </div>
      </DrawerTrigger>
      <DrawerContent className="max-w-md mx-auto left-0 right-0">
        <DrawerHeader>
          <DrawerTitle className="flex flex-col items-center">
            {selectedIconName ? "Icon Selected" : "Select Icon"}
            {SelectedIcon ? (
              <SelectedIcon className="h-16 w-16 my-4" />
            ) : (
              <CircleHelp className="h-12 w-12 my-4" />
            )}
          </DrawerTitle>
          <DrawerDescription className="w-full text-center">
            Choose an icon that best resembles your action.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <Input
            className="text-base rounded-md mb-2"
            type="search"
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ScrollArea className="h-[40vh] overflow-y-auto mb-4">
            <div className="grid grid-cols-6 gap-2 place-items-center">
              {renderContent()}
            </div>
          </ScrollArea>
          <div className="">
            <Button
              variant="default"
              className="w-full"
              onClick={() => setIsOpen(false)}
            >
              Done
            </Button>
          </div>
        </div>

        {/* <DrawerFooter> */}
        {/* <DrawerClose asChild> */}
        {/* <Button
          variant="default"
          className="m-4"
          onClick={() => setIsOpen(false)}
        >
          Done
        </Button> */}
        {/* </DrawerClose> */}
        {/* </DrawerFooter> */}
      </DrawerContent>
    </Drawer>
  );
}
