import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import dayjs from "dayjs";
import type { Todo } from "@/src/features/todo/types";

const statusColors = {
  true: "bg-emerald-200 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200",
  false: "bg-amber-200 text-amber-950 dark:bg-amber-900/40 dark:text-amber-200",
};

type Props = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onSubtaskToggle: (todoId: string, subId: string) => void;
};

export const SortableTodo = ({ todo, onToggle, onDelete, onEdit, onSubtaskToggle }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: todo.id });

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`group rounded-2xl border border-black/5 bg-linear-to-br from-white to-slate-50 p-4 transition-all dark:border-white/5 dark:from-zinc-900/80 dark:to-zinc-900 ${
        isDragging ? "shadow-2xl ring-2 ring-indigo-400/40" : "shadow-sm"
      }`}
    >
      <div className="flex items-start gap-4">
        <button
          {...listeners}
          {...attributes}
          className="mt-1 rounded-full border border-slate-200 p-2 text-slate-400 transition hover:text-slate-700 focus-visible:outline-none dark:border-zinc-700 dark:text-zinc-500"
          aria-label="드래그 핸들"
        >
          ⠿
        </button>
        <div className="flex-1 space-y-3">
          <header className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onToggle(todo.id)}
              className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
                statusColors[String(todo.completed) as keyof typeof statusColors]
              }`}
            >
              {todo.completed ? "완료" : "진행중"}
            </button>
            <h3 className="text-lg font-semibold">{todo.title}</h3>
            <span className="ml-auto rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
              {dayjs(todo.date).format("MM월 DD일")}
            </span>
          </header>
          {todo.description && <p className="text-sm text-slate-600 dark:text-zinc-300">{todo.description}</p>}
          {todo.subtasks.length > 0 && (
            <ul className="space-y-2">
              {todo.subtasks.map((subtask) => (
                <li key={subtask.id} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2 text-sm dark:bg-zinc-800/80">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => onSubtaskToggle(todo.id, subtask.id)}
                    className="size-4 rounded border-slate-200 text-indigo-500 focus:ring-indigo-400 dark:border-zinc-600"
                  />
                  <span className={subtask.completed ? "text-slate-400 line-through" : ""}>{subtask.title}</span>
                </li>
              ))}
            </ul>
          )}
          <footer className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onEdit(todo)}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-500 dark:border-zinc-700 dark:text-zinc-300"
            >
              수정
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="rounded-full border border-rose-200 px-3 py-1 text-xs font-medium text-rose-500 transition hover:bg-rose-50 dark:border-rose-400/30 dark:text-rose-300 dark:hover:bg-rose-950/30"
            >
              삭제
            </button>
            {todo.syncing && <span className="ml-auto text-xs text-slate-400">동기화 중...</span>}
          </footer>
        </div>
      </div>
    </li>
  );
};


