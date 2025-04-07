"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardDescription, CardTitle } from "@components/ui/card";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { FaSun, FaMoon } from "react-icons/fa6";
import { useUserSettings } from "@context/UserSettingsContext";
import { ERROR_COLOR } from "@lib/colors";

interface InvalidFields {
  morning: boolean;
  evening: boolean;
}

interface ValidationResult {
  error: string;
  invalidFields: InvalidFields;
}

interface TimeRange {
  min: number;
  max: number;
}

const TIME_RANGES: Record<"morning" | "evening", TimeRange> = {
  morning: { min: 4, max: 11 }, // 4 AM to 11 AM
  evening: { min: 16, max: 23 }, // 4 PM to 11 PM
};

export function DaySplit() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [invalidFields, setInvalidFields] = useState<InvalidFields>({
    morning: false,
    evening: false,
  });

  const { userSettings, userSettingsLoading, handleTimeChange } =
    useUserSettings();

  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const isTimeInRange = (
    time: string,
    minHour: number,
    maxHour: number
  ): boolean => {
    const minutes = timeToMinutes(time);
    return minutes >= minHour * 60 && minutes <= maxHour * 60;
  };

  const validateTimes = (
    morningTime: string,
    eveningTime: string
  ): ValidationResult => {
    const newInvalidFields: InvalidFields = { morning: false, evening: false };

    if (
      !isTimeInRange(
        morningTime,
        TIME_RANGES.morning.min,
        TIME_RANGES.morning.max
      )
    ) {
      newInvalidFields.morning = true;
      return {
        error: `Morning time must be between ${TIME_RANGES.morning.min}:00 AM and ${TIME_RANGES.morning.max}:00 AM`,
        invalidFields: newInvalidFields,
      };
    }

    if (
      !isTimeInRange(
        eveningTime,
        TIME_RANGES.evening.min,
        TIME_RANGES.evening.max
      )
    ) {
      newInvalidFields.evening = true;
      return {
        error: `Evening time must be between ${
          TIME_RANGES.evening.min - 12
        }:00 PM and ${TIME_RANGES.evening.max - 12}:00 PM`,
        invalidFields: newInvalidFields,
      };
    }

    const morningMinutes = timeToMinutes(morningTime);
    const eveningMinutes = timeToMinutes(eveningTime);

    const hoursDifference = (eveningMinutes - morningMinutes) / 60;

    if (hoursDifference < 6) {
      newInvalidFields.morning = true;
      newInvalidFields.evening = true;
      return {
        error:
          "There must be at least 6 hours between morning and evening times",
        invalidFields: newInvalidFields,
      };
    }

    if (hoursDifference > 18) {
      newInvalidFields.morning = true;
      newInvalidFields.evening = true;
      return {
        error: "The time between morning and evening cannot exceed 18 hours",
        invalidFields: newInvalidFields,
      };
    }

    if (eveningMinutes < morningMinutes) {
      newInvalidFields.evening = true;
      return {
        error: "Evening time cannot be before morning time",
        invalidFields: newInvalidFields,
      };
    }

    return { error: "", invalidFields: newInvalidFields };
  };

  const handleTimeWithValidation = (
    period: "morning" | "evening",
    newTime: string
  ): void => {
    const updatedTimes = {
      morning:
        period === "morning" ? newTime : userSettings?.journalStartTime.morning,
      evening:
        period === "evening" ? newTime : userSettings?.journalStartTime.evening,
    };

    const validation = validateTimes(
      updatedTimes.morning,
      updatedTimes.evening
    );
    setErrorMessage(validation.error);
    setInvalidFields(validation.invalidFields);

    if (!validation.error) {
      handleTimeChange(period, newTime);
    }
  };

  const getInputClassName = (isInvalid: boolean): string => {
    return `max-w-fit transition-all duration-200 ${
      isInvalid ? `border-${ERROR_COLOR}` : ""
    }`;
  };

  return (
    <div>
      <div className="mx-1 mb-4">
        <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {"Day Split"}
        </CardTitle>
        <CardDescription>{"Set your daily journaling hours."}</CardDescription>
      </div>
      <Card>
        <div className="px-4 py-6 flex flex-col w-full space-y-6">
          <div>
            <div className="flex items-center mb-2 ml-3">
              <span className="w-2/12 flex items-center">
                <FaSun className="text-3xl" />
              </span>

              <span className="flex flex-grow">
                <Label htmlFor="morning-start">Morning start hour</Label>
              </span>

              <span className="w-4/12 flex items-center justify-center">
                <Input
                  type="time"
                  id="morning-start"
                  className={getInputClassName(invalidFields.morning)}
                  value={userSettings?.journalStartTime.morning}
                  onChange={(e) =>
                    handleTimeWithValidation("morning", e.target.value)
                  }
                  disabled={userSettingsLoading}
                />
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center ml-3">
              <span className="w-2/12 flex items-center">
                <FaMoon className="text-3xl" />
              </span>

              <span className="flex flex-grow">
                <Label htmlFor="evening-start">Evening start hour</Label>
              </span>

              <span className="w-4/12 flex items-center justify-center">
                <Input
                  type="time"
                  id="evening-start"
                  className={getInputClassName(invalidFields.evening)}
                  value={userSettings?.journalStartTime.evening}
                  onChange={(e) =>
                    handleTimeWithValidation("evening", e.target.value)
                  }
                  disabled={userSettingsLoading}
                />
              </span>
            </div>
          </div>
          <AnimatePresence mode="wait">
            {errorMessage && (
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <p className={`text-${ERROR_COLOR} mt-2 text-sm text-center`}>
                  {errorMessage}.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}
