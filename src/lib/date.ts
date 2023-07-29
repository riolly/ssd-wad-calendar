import { generateId } from "./utils";

import type { Schedule } from "./store";

export const HOURS = [
  "00",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];
export const MINUTES = [
  "00",
  "05",
  "10",
  "15",
  "20",
  "25",
  "30",
  "35",
  "40",
  "45",
  "50",
  "55",
];
export const HOUR_FORMAT = ["AM", "PM"];

export type Ordinal = "st" | "nd" | "rd" | "th";
export const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function getTimeDisplay(time: Schedule["time"]) {
  return `${time.hour}:${time.minute} ${time.format}`;
}

export function getMonthString(date: Date) {
  // fix: zod validation for number <12
  return MONTHS[date.getMonth()]!;
}

export function getDayString(date: Date) {
  // fix: zod validation for number <=7
  return DAYS[date.getDay()]!;
}

export const getDateOrdinal = (date: Date | number): Ordinal => {
  // fix: zod validation for number <=31

  const d = typeof date === "number" ? date : date.getDay();
  if (d > 3 && d < 21) return "th";
  switch (d % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export function getNumberOfDays(dateOrMonth: Date | number) {
  // fix: zod validation for number <12
  const daysLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const idx =
    typeof dateOrMonth === "number" ? dateOrMonth : dateOrMonth.getMonth();

  return daysLength[idx]!;
}

export function getDated(date: Date) {
  return {
    id: generateId(),
    dateObj: date,
    date: date.getDate(),
    dateOrdinal: getDateOrdinal(date),
    dayStr: getDayString(date),
    month: date.getMonth(),
    monthStr: getMonthString(date),
    year: date.getFullYear(),
  };
}
