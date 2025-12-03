import type { Todo } from "@/src/features/todo/types";
import { calculateProgress } from "@/src/util/todoHelpers";

type Props = {
  todos: Todo[];
};

export const ProgressSnapshot = ({ todos }: Props) => {
  const percent = calculateProgress(todos);
  const done = todos.filter((todo) => todo.completed).length;

  return (
    <>
      <h2 className="text-xl font-semibold">Progress Snapshot</h2>
      <div className="mt-5 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span>완료율</span>
          <span>{percent}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-200 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-linear-to-r from-indigo-500 to-blue-400 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-3 dark:border-indigo-900/40 dark:bg-indigo-900/20">
            <p className="text-xs text-slate-500 dark:text-indigo-200/70">전체</p>
            <p className="text-2xl font-semibold">{todos.length}</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 dark:border-emerald-900/40 dark:bg-emerald-900/20">
            <p className="text-xs text-slate-500 dark:text-emerald-200/80">완료</p>
            <p className="text-2xl font-semibold">{done}</p>
          </div>
        </div>
      </div>
    </>
  );
};


