"use client";

import { useState, useEffect } from "react";
import { DisciplineProgressBar } from "@components/disciplines/DisciplineProgressBar";
import { IconRenderer } from "@components/IconRenderer";
import { Skeleton } from "@components/ui/skeleton";
import { useDisciplinesData } from "@hooks/disciplines/useDisciplineData";
import type { UserDisciplines } from "@models/types";
import { customStepConfigs } from "@components/journal/journal-entry-form/form-steps/steps/CustomSteps";
import React from "react";

type ProfileDisciplinesProps = {
  disciplines: UserDisciplines;
};

export function ProfileDisciplines({ disciplines }: ProfileDisciplinesProps) {
  // State to control the stable loading experience
  const [isStableLoading, setIsStableLoading] = useState(true);

  // Create a mapping from _id to discipline name and other properties
  const stepConfigMap = React.useMemo(() => {
    const map: Record<
      string,
      {
        discipline: string;
        title: string;
        description: string;
        icon: string;
        color?: string;
      }
    > = {};

    customStepConfigs.forEach((config) => {
      // Convert _id to string to ensure it can be used as an object key
      const idKey = String(config._id);
      map[idKey] = {
        discipline: config.discipline,
        title: config.title,
        description: config.description,
        icon: config.icon,
        color: config.color,
      };
    });

    return map;
  }, []);

  // Extract valid MongoDB ObjectId strings (24 hex chars)
  const ids = Object.keys(disciplines).filter((key) =>
    /^[a-f\d]{24}$/i.test(key)
  );

  // Fetch discipline data
  const {
    disciplineData,
    isLoading: isDisciplineLoading,
    error: disciplineError,
  } = useDisciplinesData(undefined, undefined, ids);

  // Use an effect to manage the stable loading state
  useEffect(() => {
    // Start with loading state
    setIsStableLoading(true);

    // Create a timer to prevent rapid loading state changes
    const loadingTimer = setTimeout(() => {
      // Only turn off loading when both data sources are ready
      if (!isDisciplineLoading) {
        setIsStableLoading(false);
      }
    }, 300); // Small delay to prevent flickering

    return () => clearTimeout(loadingTimer);
  }, [isDisciplineLoading]);

  // Check if key is a MongoDB ObjectId
  const isMongoObjectId = (key: string): boolean => /^[a-f\d]{24}$/i.test(key);

  // Check if key exists in custom step configs
  const isCustomStepConfig = (key: string): boolean =>
    stepConfigMap[key] !== undefined;

  // Check if it's any valid discipline ID (either MongoDB ObjectId OR custom step config)
  const isDisciplineId = (key: string): boolean => {
    return isMongoObjectId(key) || isCustomStepConfig(key);
  };

  const getDisplayName = (key: string): string => {
    // First check if it's in our custom step configs
    if (stepConfigMap[key]) {
      return stepConfigMap[key].discipline;
    }

    // Then check if it's in disciplineData (for MongoDB ObjectIds)
    if (disciplineData && disciplineData[key]) {
      return disciplineData[key].name;
    }

    // Convert camelCase to separate words and capitalize each word
    return key
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
  };

  // Helper function to get discipline icon
  const getDisciplineIcon = (key: string): string => {
    // First check custom step configs
    if (stepConfigMap[key]) {
      return stepConfigMap[key].icon;
    }

    // Then check disciplineData for MongoDB ObjectIds
    if (disciplineData && disciplineData[key]?.icon) {
      return disciplineData[key].icon;
    }

    // Default icon: *Motivation icon
    return "IoAccessibility";
  };

  const getColor = (key: string): string | undefined => {
    // First check custom step configs
    if (stepConfigMap[key]) {
      return stepConfigMap[key].color;
    }

    // Then check disciplineData for MongoDB ObjectIds
    if (disciplineData && disciplineData[key]?.color) {
      return disciplineData[key].color;
    }

    return undefined;
  };

  // Fixed text color logic - only MongoDB ObjectIds get primary color
  const getTextColor = (key: string): string => {
    // Only MongoDB ObjectIds should get text-primary
    // Custom step configs and other keys should get text-muted-foreground
    return isMongoObjectId(key) ? "text-primary" : "text-muted-foreground";
  };

  const renderDisciplineBars = (disciplines: UserDisciplines) => {
    return Object.entries(disciplines)
      .filter(([key]) => key !== "motivationMultiplier") // Filter out unwanted keys
      .map(([key, value]) => {
        const iconName = getDisciplineIcon(key);
        const color = getColor(key);
        const displayName = getDisplayName(key);

        return (
          <div key={`discipline-${key}`} className="flex items-center mb-5">
            <IconRenderer
              iconName={iconName}
              size={30}
              className={`${color ? `text-${color}` : ""} ml-2`}
            />
            <DisciplineProgressBar
              xp={value}
              projectedXp={0}
              name={displayName}
              color={color}
              height={8}
              textColor={getTextColor(key)}
            />
          </div>
        );
      });
  };

  // Render the loading skeletons
  const renderSkeletons = () => (
    <div className="space-y-5 mx-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={`skeleton-${i}`} className="flex items-center mb-3">
          <Skeleton className="h-8 w-8 rounded-full mr-2" />
          <div className="flex-1">
            <Skeleton className="h-8 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );

  // Show stable loading state
  if (isStableLoading) {
    return renderSkeletons();
  }

  // Handle errors
  if (disciplineError) {
    return (
      <div className="py-4 text-red-500">Error loading: {disciplineError}</div>
    );
  }

  // Only render discipline bars when disciplines exist
  const hasDisciplines = Object.keys(disciplines).length > 0;

  return (
    <div>
      {!hasDisciplines ? (
        <div className="py-4 text-muted-foreground">No disciplines found</div>
      ) : (
        renderDisciplineBars(disciplines)
      )}
    </div>
  );
}
