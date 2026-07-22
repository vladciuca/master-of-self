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
import { SearchX } from "lucide-react";
import { FaPersonCircleQuestion, FaCircleQuestion } from "react-icons/fa6";
import * as GiIcons from "react-icons/gi";
import { cn } from "@lib/utils";
import { useIconPickerSearch } from "@hooks/useIconPickerSearch";
import { useSideContentPosition } from "@hooks/useSideContentPosition";

import { FilterPill } from "@components/practices/practice-explore/FilterPill";
import { PRACTICE_ICON_CATEGORIES } from "components/ui/constants";

const practiceCategories = Object.keys(PRACTICE_ICON_CATEGORIES);

type IconPickerProps = {
  value?: string;
  onChange?: (iconName: string) => void;
  habitXp?: number;
  projectedXp?: number;
  iconPickerType?: "habits" | "practices";
  color?: string;
};

export function IconPicker({
  value,
  onChange,
  habitXp,
  projectedXp,
  iconPickerType,
  color,
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
  const [activeCategory, setActiveCategory] = useState(practiceCategories[0]);

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

  const renderIconButton = (name: string) => {
    const Icon = GiIcons[name as keyof typeof GiIcons];

    return (
      <Button
        key={name}
        variant="outline"
        className="h-12 w-12 p-0"
        onClick={() => handleSelectIcon(name)}
      >
        <Icon className="h-10 w-10" />
      </Button>
    );
  };

  const renderSearchEmptyState = () => (
    <div className="col-span-6 flex flex-col items-center justify-center py-8">
      <SearchX className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-center text-muted-foreground">
        No icons found for &quot;{searchTerm}&quot;.
        <br />
        Try a different search term.
      </p>
    </div>
  );

  const renderPracticeIcons = () => {
    if (isLoading || isSearching) {
      return Array.from({ length: 30 }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-12" />
      ));
    }

    if (searchTerm) {
      if (filteredIcons.length === 0) return renderSearchEmptyState();
      return filteredIcons.map(({ name }) => renderIconButton(name));
    }

    return PRACTICE_ICON_CATEGORIES[activeCategory].map(renderIconButton);
  };

  const renderHabitIcons = () => {
    if (isLoading || isSearching) {
      return Array.from({ length: 30 }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-12" />
      ));
    } else if (filteredIcons.length === 0) {
      return renderSearchEmptyState();
    } else {
      return filteredIcons.map(({ name }) => renderIconButton(name));
    }
  };

  const defaultSearchIcon =
    iconPickerType === "habits" ? (
      <FaCircleQuestion className="h-16 w-16 my-4" />
    ) : (
      <FaPersonCircleQuestion className="h-16 w-16 my-4" />
    );

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
          {iconPickerType === "practices" ? (
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start font-normal"
            >
              {SelectedIcon ? (
                <span className="flex items-center">
                  <SelectedIcon
                    className="h-5 w-5 mr-2"
                    style={color ? { color } : undefined}
                  />
                  <span>{selectedIconName}</span>
                </span>
              ) : (
                <span className="text-muted-foreground">Browse icons</span>
              )}
            </Button>
          ) : (
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
                <>{defaultSearchIcon}</>
              )}
            </div>
          )}
        </DrawerTrigger>
      </div>

      <DrawerContent className="max-w-md mx-auto right-0" style={drawerStyle}>
        <DrawerHeader>
          <DrawerTitle className="flex flex-col items-center">
            {selectedIconName ? "Icon Selected" : "Select Icon"}
            {SelectedIcon ? (
              <SelectedIcon className="h-16 w-16 my-4" />
            ) : (
              <>{defaultSearchIcon}</>
            )}
          </DrawerTitle>
        </DrawerHeader>
        <div className="p-4 pt-0">
          <Input
            className={`text-base mb-2 ${cn(
              "rounded-full focus:rounded-md active:rounded-md",
              "appearance-none",
              "safari-rounded-fix"
            )}`}
            type="search"
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {iconPickerType === "practices" && !searchTerm && (
            <div className="flex gap-2 overflow-x-auto py-2 mb-2">
              {practiceCategories.map((category) => (
                <FilterPill
                  key={category}
                  label={category}
                  selected={activeCategory === category}
                  onToggle={() => setActiveCategory(category)}
                />
              ))}
            </div>
          )}

          <div
            className={`${
              iconPickerType === "practices" ? "h-[35vh]" : "h-[35vh]"
            } mb-4 overflow-y-scroll`}
          >
            <div className="grid grid-cols-6 gap-2 place-items-center">
              {iconPickerType === "practices" && renderPracticeIcons()}
              {iconPickerType === "habits" && renderHabitIcons()}
            </div>
          </div>
          <DrawerClose asChild>
            <Button variant="default" className="w-full rounded-full">
              Done
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
