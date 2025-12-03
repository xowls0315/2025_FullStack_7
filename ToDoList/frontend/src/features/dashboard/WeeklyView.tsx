import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import type { Todo } from "@/src/features/todo/types";

type Props = {
  weekDays: Dayjs[];
  todos: Todo[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
  onShiftWeek: (direction: "prev" | "next") => void;
};

export const WeeklyView = ({ weekDays, todos, selectedDate, onSelectDate, onShiftWeek }: Props) => {
  return (
    <>
      <h2 className="text-xl font-semibold">Weekly View</h2>
      <p className="text-sm text-slate-500 dark:text-zinc-300">주간 일정과 Todo 분포를 빠르게 확인하세요.</p>
      <div className="mt-5 grid grid-cols-7 gap-3">
        {weekDays.map((day) => {
          const dateKey = day.format("YYYY-MM-DD");
          const count = todos.filter((todo) => todo.date === dateKey).length;
          const isSelected = selectedDate === dateKey;
          const isToday = day.isSame(dayjs(), "day");
          return (
            <button
              key={dateKey}
              onClick={() => onSelectDate(selectedDate === dateKey ? null : dateKey)}
              className={`flex flex-col items-center rounded-2xl border px-2 py-3 text-sm transition ${
                isSelected
                  ? "border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10"
                  : "border-slate-200 bg-white hover:border-indigo-300 dark:border-zinc-700 dark:bg-zinc-900"
              }`}
            >
              <span className="text-xs text-slate-500 dark:text-zinc-400">{day.format("ddd")}</span>
              <span className={`text-lg font-semibold ${isToday && !isSelected ? "text-emerald-500" : ""}`}>
                {day.format("DD")}
              </span>
              <span className="mt-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-zinc-800">
                {count}건
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex justify-between text-sm text-slate-500 dark:text-zinc-400">
        <button type="button" onClick={() => onShiftWeek("prev")}>
          ◀ 이전 주
        </button>
        <button type="button" onClick={() => onShiftWeek("next")}>
          다음 주 ▶
        </button>
      </div>
    </>
  );
};


