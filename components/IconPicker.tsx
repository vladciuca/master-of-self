"use client";

import React, { useState, useEffect } from "react";
import { HabitIconProgressBar } from "@components/habits/habit-actions/HabitIconProgressBar";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
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
  habitXp?: number;
};

export function IconPicker({ value, onChange, habitXp }: IconPickerProps) {
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

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
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
          <SearchX className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-center text-muted-foreground">
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
        <div className="flex justify-center cursor-pointer">
          {SelectedIcon ? (
            <HabitIconProgressBar
              icon={selectedIconName || ""}
              xp={habitXp || 0}
            />
          ) : (
            <CircleHelp className="h-14 w-14 mx-5 text-muted-foreground" />
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
        <div className="pb-4 pt-0">
          <div className="px-4">
            <Input
              className="text-base rounded-md mb-2"
              type="search"
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[40vh] mb-4 px-1 mx-1">
            <div className="grid grid-cols-6 gap-2 place-items-center">
              {renderContent()}
            </div>
          </ScrollArea>
          <DrawerClose asChild>
            <div className="px-4">
              <Button variant="default" className="w-full">
                Done
              </Button>
            </div>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
