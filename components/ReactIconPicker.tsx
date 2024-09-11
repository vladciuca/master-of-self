import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIconSearch } from "@hooks/useIconSearch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CircleHelp, Plus } from "lucide-react";
import * as GiIcons from "react-icons/gi";

type ReactIconPickerProps = {
  value?: string;
  onChange?: (iconName: string) => void;
};

export function ReactIconPicker({ value, onChange }: ReactIconPickerProps) {
  const {
    searchTerm,
    setSearchTerm,
    selectedIconName,
    setSelectedIconName,
    filteredIcons,
  } = useIconSearch(value);

  const handleSelectIcon = (iconName: string) => {
    setSelectedIconName(iconName);
    if (onChange) {
      onChange(iconName);
    }
  };

  const SelectedIcon = selectedIconName
    ? GiIcons[selectedIconName as keyof typeof GiIcons]
    : null;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="w-full">
          {SelectedIcon ? (
            <SelectedIcon className="h-24 w-24 mx-auto" />
          ) : (
            <Button variant="outline" className="h-16 w-16 rounded-full">
              <Plus />
            </Button>
          )}
        </div>
      </DrawerTrigger>
      <DrawerContent className="max-w-md mx-auto left-0 right-0">
        <DrawerHeader>
          <DrawerTitle className="flex flex-col items-center">
            {selectedIconName ? "Icon Selected" : "Select Icon"}
            {SelectedIcon ? (
              <SelectedIcon className="h-12 w-12 my-4" />
            ) : (
              <CircleHelp className="h-12 w-12 my-4" />
            )}
          </DrawerTitle>
          <DrawerDescription>
            Choose an icon that best resembles your action.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pb-0">
          <Input
            className="text-base"
            type="search"
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ScrollArea className="h-[40vh] p-4">
          <div className="grid grid-cols-6 gap-2 place-items-center">
            {filteredIcons.map(({ name, icon: Icon }) => (
              <Button
                key={name}
                variant="outline"
                className="h-12 w-12 p-0"
                onClick={() => handleSelectIcon(name)}
              >
                <Icon className="h-6 w-6" />
              </Button>
            ))}
          </div>
        </ScrollArea>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
