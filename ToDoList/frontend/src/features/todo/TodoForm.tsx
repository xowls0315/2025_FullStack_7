import type { FormEvent } from "react";
import type { Subtask, TodoFormState } from "@/src/features/todo/types";

type Props = {
  form: TodoFormState;
  subtaskDraft: string;
  onChangeForm: (next: TodoFormState) => void;
  onChangeSubtaskDraft: (value: string) => void;
  onAddSubtask: () => void;
  onRemoveSubtask: (id: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
};

export const TodoForm = ({ form, subtaskDraft, onChangeForm, onChangeSubtaskDraft, onAddSubtask, onRemoveSubtask, onSubmit, onReset }: Props) => {
  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium">
          제목
          <input
            value={form.title}
            onChange={(e) => onChangeForm({ ...form, title: e.target.value })}
            placeholder="예) 디자인 QA 회의"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition focus:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
        <label className="space-y-2 text-sm font-medium">
          일정 날짜
          <input
            type="date"
            value={form.date}
            onChange={(e) => onChangeForm({ ...form, date: e.target.value })}
            className="date-input w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
      </div>
      <label className="space-y-2 text-sm font-medium">
        설명
        <textarea
          value={form.description}
          onChange={(e) => onChangeForm({ ...form, description: e.target.value })}
          placeholder="세부 내용을 적어주세요."
          rows={3}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </label>
      <div className="space-y-3 rounded-2xl border border-dashed border-slate-200 p-4 dark:border-zinc-700">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium">Subtask</span>
          <div className="flex flex-1 gap-2">
            <input
              value={subtaskDraft}
              onChange={(e) => onChangeSubtaskDraft(e.target.value)}
              placeholder="세부 작업 추가"
              className="flex-1 rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-900"
            />
            <button type="button" onClick={onAddSubtask} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600 dark:bg-white dark:text-black">
              추가
            </button>
          </div>
        </div>
        {form.subtasks.length > 0 && (
          <ul className="space-y-2">
            {form.subtasks.map((subtask) => (
              <li key={subtask.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-sm dark:bg-zinc-800">
                <span>{subtask.title}</span>
                <button type="button" onClick={() => onRemoveSubtask(subtask.id)} className="text-xs text-rose-500 hover:text-rose-600">
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="submit" className="rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500">
          {form.id ? "업데이트" : "등록"}
        </button>
        {form.id && (
          <button
            type="button"
            onClick={onReset}
            className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 dark:border-zinc-700 dark:text-zinc-300"
          >
            취소
          </button>
        )}
      </div>
    </form>
  );
};
