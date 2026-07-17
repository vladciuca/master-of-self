"use client";

import { useState, useEffect } from "react";
import { XpProgressBar } from "@components/practices/XpProgressBar";
import { IconRenderer } from "@components/IconRenderer";
import { Skeleton } from "@components/ui/skeleton";
import { usePracticeData } from "@hooks/practices/usePracticeData";
import type { UserPractices } from "@models/types";
import { isHexColor } from "@lib/utils";
import { customStepConfigs } from "@components/journal/journal-entry-form/form-steps/steps/CustomSteps";
import React from "react";

type ProfilePracticesProps = {
  practices: UserPractices;
};

export function ProfilePractices({ practices }: ProfilePracticesProps) {
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
  const ids = Object.keys(practices).filter((key) =>
    /^[a-f\d]{24}$/i.test(key)
  );

  // Fetch practice data
  const {
    practiceData,
    isLoading: isPracticeLoading,
    error: practiceError,
  } = usePracticeData(undefined, undefined, ids);

  // Use an effect to manage the stable loading state
  useEffect(() => {
    // Start with loading state
    setIsStableLoading(true);

    // Create a timer to prevent rapid loading state changes
    const loadingTimer = setTimeout(() => {
      // Only turn off loading when both data sources are ready
      if (!isPracticeLoading) {
        setIsStableLoading(false);
      }
    }, 300); // Small delay to prevent flickering

    return () => clearTimeout(loadingTimer);
  }, [isPracticeLoading]);

  // Check if key is a MongoDB ObjectId
  const isMongoObjectId = (key: string): boolean => /^[a-f\d]{24}$/i.test(key);

  // Check if key exists in custom step configs
  const isCustomStepConfig = (key: string): boolean =>
    stepConfigMap[key] !== undefined;

  // Check if it's any valid practice ID (either MongoDB ObjectId OR custom step config)
  const isPracticeId = (key: string): boolean => {
    return isMongoObjectId(key) || isCustomStepConfig(key);
  };

  const getDisplayName = (key: string): string => {
    // First check if it's in our custom step configs
    if (stepConfigMap[key]) {
      return stepConfigMap[key].discipline;
    }

    // Then check if it's in practiceData (for MongoDB ObjectIds)
    if (practiceData && practiceData[key]) {
      return practiceData[key].name;
    }

    // Convert camelCase to separate words and capitalize each word
    return key
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
  };

  // Helper function to get practice icon
  const getPracticeIcon = (key: string): string => {
    // First check custom step configs
    if (stepConfigMap[key]) {
      return stepConfigMap[key].icon;
    }

    // Then check practiceData for MongoDB ObjectIds
    if (practiceData && practiceData[key]?.icon) {
      return practiceData[key].icon;
    }

    // Default icon
    return "IoAccessibility";
  };

  const getColor = (key: string): string | undefined => {
    // First check custom step configs
    if (stepConfigMap[key]) {
      return stepConfigMap[key].color;
    }

    // Then check practiceData for MongoDB ObjectIds
    if (practiceData && practiceData[key]?.color) {
      return practiceData[key].color;
    }

    return undefined;
  };

  // Fixed text color logic - only MongoDB ObjectIds get primary color
  const getTextColor = (key: string): string => {
    // Only MongoDB ObjectIds should get text-primary
    // Custom step configs and other keys should get text-muted-foreground
    return isMongoObjectId(key) ? "text-primary" : "text-muted-foreground";
  };

  const renderPracticeBars = (practices: UserPractices) => {
    return Object.entries(practices)
      .filter(([key]) => key !== "_disciplineMultiplier")
      .map(([key, value]) => {
        const iconName = getPracticeIcon(key);
        const color = getColor(key);
        const displayName = getDisplayName(key);

        return (
          <div key={`practice-${key}`} className="flex items-center mb-5">
            <IconRenderer
              iconName={iconName}
              size={30}
              className={`${isHexColor(color) ? "" : `text-${color}`} ml-2`}
              style={isHexColor(color) ? { color } : undefined}
            />
            <XpProgressBar
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
  if (practiceError) {
    return (
      <div className="py-4 text-red-500">Error loading: {practiceError}</div>
    );
  }

  // Only render practice bars when practices exist
  const hasPractices = Object.keys(practices).length > 0;

  return (
    <div>
      {!hasPractices ? (
        <div className="py-4 text-muted-foreground">No practices found</div>
      ) : (
        renderPracticeBars(practices)
      )}
    </div>
  );
}
