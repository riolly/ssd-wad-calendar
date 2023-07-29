import { DAYS, getDated } from "./lib/date";
import { useDatedStore } from "./lib/store";
import DateCell, { PrevNextDateCell } from "./components/DateCell";
import ScheduleCreateDialog from "./components/ScheduleCreate";
import ScheduleEditDialog from "./components/ScheduleEdit";

export default function HomePage() {
  // toDate mean today
  const toDate = new Date();
  const toDated = getDated(toDate);

  const prevDates = useDatedStore((state) => state.prevDates);
  const nextDates = useDatedStore((state) => state.nextDates);

  const dateds = useDatedStore((state) => state.dateds);

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b overflow-clip from-blue-950 to-violet-950 text-white relative">
      <div className="absolute w-[200%] h-[200%] -top-[37%] bg-pattern bg-opacity-50 rotate-12"></div>
      <div className="absolute w-full h-full bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80"></div>
      <div className="absolute w-full h-1/3 bg-gradient-to-b from-slate-950 to-transparent"></div>

      <div className="container flex flex-col items-center py-12 ">
        <h1 className="-mt-2 mb-8 text-4xl font-semibold z-10">
          {toDated.monthStr} {toDated.year}
        </h1>

        <div className="grid grid-cols-7 overflow-clip rounded-t-xl backdrop-blur-lg shadow-xl shadow-white/10">
          {DAYS.map((day) => (
            <DayHeading key={day} day={day} />
          ))}
          {prevDates.map((date) => (
            <PrevNextDateCell key={date.id} {...date} />
          ))}
          {dateds.map((dated) => (
            <DateCell
              key={dated.id}
              {...dated}
              isToday={toDated.date === dated.date}
            />
          ))}
          {nextDates.map((date) => (
            <PrevNextDateCell key={date.id} {...date} />
          ))}
        </div>
        <ScheduleCreateDialog />
        <ScheduleEditDialog />
      </div>
    </main>
  );
}

function DayHeading(props: { day: string }) {
  return (
    <div className="flex justify-center bg-blue-100 py-2 text-lg font-semibold text-blue-950">
      {props.day}
    </div>
  );
}
