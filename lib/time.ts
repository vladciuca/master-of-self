//NOTE: try and use getCurrentTimePeriod instead of isEvening
export function isEvening(
  startTime: string | undefined,
  now: Date = new Date()
): boolean {
  if (!startTime) return false;

  // Extract hour and minute from the given start time (expected in HH:MM format)
  const [startHourStr, startMinuteStr] = startTime.split(":");
  const startHour = parseInt(startHourStr, 10);
  const startMinute = parseInt(startMinuteStr, 10);

  // Validate input to ensure it's a proper time format
  if (
    isNaN(startHour) ||
    isNaN(startMinute) ||
    startHour < 0 ||
    startHour > 23 ||
    startMinute < 0 ||
    startMinute > 59
  ) {
    throw new Error("Invalid time format. Please use HH:MM (24-hour format)");
  }

  // Get the current time
  // const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Convert both times to minutes since midnight
  const startTimeInMinutes = startHour * 60 + startMinute;
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  // If the start time is in the evening (e.g., 23:40), but the current time is after midnight, handle rollover
  if (startTimeInMinutes >= 18 * 60) {
    // Evening starts at 18:00 (6 PM)
    return currentTimeInMinutes >= startTimeInMinutes || currentHour < 6; // Midnight to 6 AM is still evening
  }
  // Check if the current time is after the start time

  return currentTimeInMinutes >= startTimeInMinutes;
}

/**
 * Returns today's date at 00:00:00.000
 */
export const getToday = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/**
 * Returns tomorrow's date at 00:00:00.000
 */
export const getTomorrow = (): Date => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
};

/**
 * Returns yesterday's date at 00:00:00.000
 */
export const getYesterday = (): Date => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  return yesterday;
};

/**
 * Returns the start of the current week (Monday at 00:00:00.000)
 */
export const getStartOfCurrentWeek = (): Date => {
  const today = new Date();
  const startOfWeek = new Date(today); // converts index 0 (Sunday) to 6 (Saturday)

  // Adjust to the start of the week (Monday)
  startOfWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7)); // Ensures Monday start of week
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
};

/**
 * Returns the end of the current week (Sunday at 23:59:59.999)
 */
export const getEndOfCurrentWeek = (): Date => {
  const startOfWeek = getStartOfCurrentWeek();
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6); // Move to Sunday as end of week
  endOfWeek.setHours(23, 59, 59, 999);
  return endOfWeek;
};

// JOURNAL ENTRY LIST FILTER FUNCTIONS

/**
 * Checks if a given date falls within the current week (Monday-Sunday)
 */
export function isThisWeek(date: Date): boolean {
  const weekStart = getStartOfCurrentWeek();
  const weekEnd = getEndOfCurrentWeek();

  return date >= weekStart && date <= weekEnd;
}

/**
 * Checks if a given date is in the current month
 */
export function isThisMonth(date: Date): boolean {
  const now = new Date();
  return (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

/**
 * Checks if a given date matches the current month and year
 */
export function isCurrentMonthYear(date: Date): boolean {
  const now = new Date();
  return (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

/**
 * Checks if a given date belongs to a specific month and year
 * @param date - The date to check
 * @param monthYear - String in format "Month Year" (e.g., "January 2024")
 */
export function isSpecificMonthYear(date: Date, monthYear: string): boolean {
  return (
    date.toLocaleString("default", { month: "long", year: "numeric" }) ===
    monthYear
  );
}

/**
 * Converts a time string (HH:MM) to a Date object with those hours and minutes
 */
export function getTimeFromString(timeString: string | undefined): Date {
  if (!timeString) {
    // Default fallback
    const defaultTime = new Date();
    defaultTime.setHours(0, 0, 0, 0);
    return defaultTime;
  }

  const [hours, minutes] = timeString.split(":").map(Number);
  const time = new Date();
  time.setHours(hours || 0, minutes || 0, 0, 0);
  return time;
}

/**
 * Checks if the current date is before the given time
 */
export function isBeforeTime(date: Date, time: Date): boolean {
  return (
    date.getHours() < time.getHours() ||
    (date.getHours() === time.getHours() &&
      date.getMinutes() < time.getMinutes())
  );
}

/**
 * Calculate time difference between two dates
 */
export function getTimeDifference(start: Date, end: Date): Date {
  return new Date(end.getTime() - start.getTime());
}

/**
 * Format time difference as "Xh Ym"
 */
export function formatTimeDifference(date: Date): string {
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  if (hours === 0) {
    return `${minutes}m`;
  }

  return `${hours}h ${minutes}m`;
}

/**
 * Checks if current time is in sleep period (after evening time, before morning time)
 */
export function isSleepTime(
  morningTime: string | undefined,
  eveningTime: string | undefined
): boolean {
  if (!morningTime || !eveningTime) return false;

  const now = new Date();
  const morning = getTimeFromString(morningTime);
  const evening = getTimeFromString(eveningTime);

  return isBeforeTime(now, morning);
}

/**
 * Gets the countdown time to the next time period
 */
export function getCountdownToNextPeriod(
  morningTime: string | undefined,
  eveningTime: string | undefined
): string {
  if (!morningTime || !eveningTime) return "--:--";

  const now = new Date();
  const morning = getTimeFromString(morningTime);
  const evening = getTimeFromString(eveningTime);

  if (isBeforeTime(now, morning)) {
    // Countdown to morning
    const diff = getTimeDifference(now, morning);
    return formatTimeDifference(diff);
  } else if (isBeforeTime(now, evening)) {
    // Countdown to evening
    const diff = getTimeDifference(now, evening);
    return formatTimeDifference(diff);
  } else {
    // Countdown to midnight/next day's morning
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const diff = getTimeDifference(now, midnight);
    return formatTimeDifference(diff);
  }
}

//===============================================================================
//NOTE: add constants for time periods
// export const TIME_PERIODS = {
//   DAY: 'day',
//   NIGHT: 'night',
//   SLEEP: 'sleep'
// } as const;

// // Then update your getCurrentTimePeriod return type
// export function getCurrentTimePeriod(
//   morningTime: string | undefined,
//   eveningTime: string | undefined
// ): typeof TIME_PERIODS[keyof typeof TIME_PERIODS] {
//   // ...existing function...
// }

/**
 * Determines the current time period based on user profile settings
 * @returns 'day', 'night', or 'sleep'
 */
export function getCurrentTimePeriod(
  morningTime: string | undefined,
  eveningTime: string | undefined
): "day" | "night" | "sleep" {
  if (!morningTime || !eveningTime) return "day";

  const now = new Date();
  const morning = getTimeFromString(morningTime);
  const evening = getTimeFromString(eveningTime);

  if (isBeforeTime(now, morning)) {
    // Before morning time (Sleep period)
    return "sleep";
  } else if (isBeforeTime(now, evening)) {
    // Between morning and evening (Day period)
    return "day";
  } else {
    // After evening time (Night period)
    return "night";
  }
}
