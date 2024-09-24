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
