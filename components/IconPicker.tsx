"use client";

import React, { useState, useEffect } from "react";
import { HabitIconProgressBar } from "@components/habits/HabitIconProgressBar";
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
import { cn } from "@lib/utils";
import { useIconPickerSearch } from "@hooks/useIconPickerSearch";
import { useSideContentPosition } from "@hooks/useSideContentPosition";

type IconPickerProps = {
  value?: string;
  onChange?: (iconName: string) => void;
  habitXp?: number;
  projectedXp?: number;
};

export function IconPicker({
  value,
  onChange,
  habitXp,
  projectedXp,
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

  const { drawerStyle } = useSideContentPosition();

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
      <div className="w-full flex justify-center items-center">
        <DrawerTrigger asChild>
          <div className="inline-flex cursor-pointer">
            {SelectedIcon ? (
              <HabitIconProgressBar
                icon={selectedIconName || ""}
                xp={habitXp || 0}
                projectedXp={projectedXp}
                displayXpValues
                displayLevelValues
              />
            ) : (
              <CircleHelp className="h-14 w-14 text-muted-foreground" />
            )}
          </div>
        </DrawerTrigger>
      </div>

      <DrawerContent className="max-w-md mx-auto right-0" style={drawerStyle}>
        <DrawerHeader>
          <DrawerTitle className="flex flex-col items-center">
            {selectedIconName ? "Icon Selected" : "Select Icon"}
            {SelectedIcon ? (
              <SelectedIcon className="h-16 w-16 my-4" />
            ) : (
              <CircleHelp className="h-16 w-16 my-4" />
            )}
          </DrawerTitle>
          <DrawerDescription className="w-full text-center">
            Choose an icon that best resembles your action.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pt-0">
          <Input
            className={`text-base mb-2 ${cn(
              "rounded-md focus:rounded-md active:rounded-md",
              "appearance-none",
              "safari-rounded-fix"
            )}`}
            type="search"
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="h-[40vh] mb-4 overflow-y-scroll">
            <div className="grid grid-cols-6 gap-2 place-items-center">
              {renderContent()}
            </div>
          </div>
          <DrawerClose asChild>
            <Button variant="default" className="w-full">
              Done
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
