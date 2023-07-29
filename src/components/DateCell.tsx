import { PlusIcon, User, Users } from "lucide-react";

import { useRandomColors } from "../lib/style";
import { cn } from "../lib/utils";
import { useCalendarStore, useScheduleStore } from "../lib/store";
import type { Dated, PrevNextDate } from "../lib/store";

interface Props extends Dated {
  isToday: boolean;
}
export default function DayCell({ isToday, ...dated }: Props) {
  const schedules = useScheduleStore((state) =>
    state.getScheduleByDate(dated.id),
  );
  const setSelectedDate = useCalendarStore((state) => state.setSelectedDate);
  const setSelectedSchedule = useCalendarStore(
    (state) => state.setSelectedSchedule,
  );
  const setIsCreateScheduleOpen = useCalendarStore(
    (state) => state.setIsCreateScheduleOpen,
  );
  const setIsEditScheduleOpen = useCalendarStore(
    (state) => state.setIsEditScheduleOpen,
  );

  function createScheduleModal() {
    setSelectedDate(dated.id);
    setIsCreateScheduleOpen(true);
  }

  function editScheduleModal(id: string) {
    setSelectedSchedule(id);
    setIsEditScheduleOpen(true);
  }

  const colors = useRandomColors(3);

  const isSaturday = dated.date % 7 === 1;
  const isSunday = dated.date % 7 === 2;

  return (
    <div
      className={cn(
        "group relative flex h-32 w-44 cursor-pointer border border-white border-opacity-30 bg-slate-900 bg-opacity-30 p-0 text-slate-50 text-opacity-70",
        isToday &&
          "border-2 border-blue-300 border-opacity-100 font-bold text-opacity-100",
        isSaturday && "bg-cyan-700",
        isSunday && "bg-green-600",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute right-2 top-1 z-20 origin-top-right text-slate-200 text-opacity-70 transition-transform group-hover:scale-150 group-hover:text-opacity-100",
          isToday && "underline underline-offset-4",
        )}
      >
        {dated.date}
      </div>
      <div className="flex w-full flex-col gap-0.5 p-0.5">
        {schedules.map((s, i) => (
          <button
            key={s.id}
            onClick={(e) => {
              e.stopPropagation();
              editScheduleModal(s.id);
            }}
            className={cn(
              "group z-10 flex w-full flex-col items-start rounded bg-green-700 bg-opacity-70 px-2 py-0.5 transition-all hover:scale-110 hover:bg-opacity-100",
              colors[i]?.name,
            )}
          >
            <p className="text-op line-clamp-1 text-left text-sm leading-[1.15rem] text-white ">
              {s.name}
            </p>
            <div className="flex w-full justify-between">
              <time className="text-[0.7rem]">
                {s.time.hour}:{s.time.minute} {s.time.format}
              </time>
              {s.invitations && (
                <div className="flex gap-1">
                  {s.invitations.length === 1 && <User size={14} />}
                  {s.invitations.length >= 2 && <Users size={14} />}
                  {s.invitations.length >= 3 && (
                    <span className="text-xs">{s.invitations.length}</span>
                  )}
                </div>
              )}
            </div>
          </button>
        ))}
        {schedules.length < 3 && (
          <button
            onClick={createScheduleModal}
            className="flex w-full grow flex-col items-center justify-center gap-3 rounded-lg border-2 border-blue-100 border-opacity-0 bg-gray-500/20 text-white opacity-0 backdrop-blur transition-opacity hover:border-opacity-100 focus:opacity-100 group-hover:opacity-100"
          >
            {/* <span className="flex">
              <span className="text-[200%]">{dated.date}</span>
              <span>{dated.dateOrdinal}</span>
            </span> */}
            <span className="flex gap-1">
              <PlusIcon />
              <span>Add schedule</span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export function PrevNextDateCell(date: PrevNextDate) {
  return (
    <div className="h-32 w-44 border border-white border-opacity-30 bg-gray-500 bg-opacity-30 pl-2 pt-1 text-gray-500">
      {date.date}
    </div>
  );
}
