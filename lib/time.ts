export function isEvening(startTime: string | undefined): boolean {
  if (!startTime) return false;

  const [startHourStr, startMinuteStr] = startTime.split(":");
  const startHour = parseInt(startHourStr, 10);
  const startMinute = parseInt(startMinuteStr, 10);

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

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Convert both times to minutes since midnight
  const startTimeInMinutes = startHour * 60 + startMinute;
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  // Check if the current time is after the start time
  // If the start time is after midnight (e.g., "23:40"), we need to handle it differently
  if (startTimeInMinutes <= 24 * 60) {
    return currentTimeInMinutes >= startTimeInMinutes;
  } else {
    return (
      currentTimeInMinutes >= startTimeInMinutes ||
      currentTimeInMinutes < startTimeInMinutes % (24 * 60)
    );
  }
}

export const getToday = (): Date => {
  // return new Date().toISOString().split("T")[0];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const getTomorrow = (): Date => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  // return tomorrow.toISOString().split("T")[0];
  return tomorrow;
};

export const getYesterday = (): Date => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  // return yesterday.toISOString().split("T")[0];
  return yesterday;
};

export const getStartOfCurrentWeek = (): Date => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
};

export const getEndOfCurrentWeek = (): Date => {
  const startOfWeek = getStartOfCurrentWeek();
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return endOfWeek;
};
