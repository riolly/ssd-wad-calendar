import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { generateId } from "./utils";

import type { Ordinal } from "./date";
import { getDated, getDateOrdinal, getNumberOfDays } from "./date";

export type PrevNextDate = Pick<Dated, "id" | "date" | "dateOrdinal">;

function initPrevNextDated(toDated: Dated): {
  prevDates: PrevNextDate[];
  nextDates: PrevNextDate[];
} {
  const firstDate = new Date(toDated.dateObj.setDate(1));
  const prevFillDaysLenght = firstDate.getDay(); // as gap before the first day
  const prevMonthDaysLenght = getNumberOfDays(
    toDated.month === 1 ? 12 : toDated.month - 1,
  );
  const prevDates = Array.from({ length: prevFillDaysLenght }, (_, i) => {
    const date = prevMonthDaysLenght - (prevFillDaysLenght - (i + 1));
    return {
      id: generateId(),
      date: date,
      dateOrdinal: getDateOrdinal(date),
    };
  }) as PrevNextDate[];

  const incompleteLength = prevFillDaysLenght + getNumberOfDays(toDated.month);
  const nextMonthDaysLenght =
    Math.ceil(incompleteLength / 7) * 7 - incompleteLength;
  const nextDates = Array.from({ length: nextMonthDaysLenght }, (_, i) => {
    return {
      id: generateId(),
      date: i + 1,
      dateOrdinal: getDateOrdinal(i + 1),
    };
  }) as PrevNextDate[];
  return { prevDates, nextDates };
}

function initDateds(todayDate: Date): Dated[] {
  const tDate = new Date(todayDate);
  const daysLength = getNumberOfDays(todayDate);

  return Array.from({ length: daysLength }, (_, i) => {
    tDate.setDate(i + 1);
    return getDated(new Date(tDate));
  });
}

// ---- DATED -----

export interface Dated {
  id: string;
  dateObj: Date;
  date: number;
  dayStr: string;
  dateOrdinal: Ordinal;
  month: number;
  monthStr: string;
  year: number;
}

interface DatedStore {
  dateds: Dated[];
  prevDates: PrevNextDate[];
  nextDates: PrevNextDate[];
}

export const useDatedStore = create<DatedStore>()(
  persist(
    immer(() => {
      const toDate = new Date();
      return {
        dateds: initDateds(toDate),
        ...initPrevNextDated(getDated(toDate)),
      };
    }),
    { name: "skechdule-dated" },
  ),
);

// --- CALENDAR ---
interface CalendarStore {
  selectedDate: Dated | null;
  selectedSchedule: Schedule | null;
  isCreateScheduleOpen: boolean;
  isEditScheduleOpen: boolean;
  setSelectedDate: (id: string) => void;
  setSelectedSchedule: (id: string) => void;
  setIsCreateScheduleOpen: (isOpen: boolean) => void;
  setIsEditScheduleOpen: (isOpen: boolean) => void;
}

export const useCalendarStore = create<CalendarStore>()(
  persist(
    immer((set) => ({
      selectedDate: null,
      selectedSchedule: null,
      isCreateScheduleOpen: false,
      isEditScheduleOpen: false,
      setSelectedDate: (id) =>
        set((state) => {
          const dateds = useDatedStore.getState().dateds;
          const selection = dateds.find((d) => d.id === id);
          if (selection) {
            state.selectedDate = selection;
          }
        }),
      setSelectedSchedule: (id) =>
        set((state) => {
          const schedules = useScheduleStore.getState().schedules;
          const selection = schedules.find((d) => d.id === id);
          if (selection) {
            state.selectedSchedule = selection;
          }
        }),
      setIsCreateScheduleOpen: (isOpen) =>
        set((state) => {
          state.isCreateScheduleOpen = isOpen;
        }),
      setIsEditScheduleOpen: (isOpen) =>
        set((state) => {
          state.isEditScheduleOpen = isOpen;
        }),
    })),
    { name: "sketchdule-calendar" },
  ),
);

// --- SCHEDULE ---

export interface Schedule {
  id: string;
  name: string;
  time: {
    hour: string;
    minute: string;
    format: string;
  };
  invitations?: { address: string }[];
  dateId: string;
}

interface ScheduleStore {
  schedules: Schedule[];
  addSchedule: (scheduleNew: Omit<Schedule, "id">) => void;
  editSchedule: (scheduleNew: Schedule) => void;
  removeSchedule: (id: string) => void;
  getScheduleByDate: (id: string) => Schedule[];
}

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    immer((set, get) => ({
      schedules: [],
      addSchedule: (scheduleNew) =>
        set((state) => {
          state.schedules.push({ ...scheduleNew, id: generateId() });
        }),
      editSchedule: (edited) =>
        set((state) => {
          const idx = state.schedules.findIndex((s) => s.id === edited.id);
          if (idx !== -1) {
            state.schedules[idx] = edited;
          }
        }),
      removeSchedule: (id) =>
        set((state) => {
          const idx = state.schedules.findIndex((s) => s.id === id);
          if (idx !== -1) {
            state.schedules.splice(idx, 1);
          }
        }),
      getScheduleByDate: (id) => get().schedules.filter((s) => s.dateId === id),
    })),
    {
      name: "skechdule-schedule",
    },
  ),
);
