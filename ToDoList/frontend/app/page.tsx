"use client";

import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { Card } from "@/src/components/Card";
import { useTheme } from "@/src/features/theme/useTheme";
import { Header } from "@/src/features/layout/Header";
import { TodoForm } from "@/src/features/todo/TodoForm";
import { WeeklyView } from "@/src/features/dashboard/WeeklyView";
import { ProgressSnapshot } from "@/src/features/dashboard/ProgressSnapshot";
import { getCurrentWeek } from "@/src/util/todoHelpers";
import { useTodos } from "@/src/features/todo/useTodos";

const TodoList = dynamic(() => import("@/src/features/todo/TodoList").then((mod) => mod.TodoList), { ssr: false });

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [weekOffset, setWeekOffset] = useState(0);

  // ✅ 초기 선택 날짜를 "오늘"로 설정 → 첫 화면에 오늘 Todo만 보이게
  const [selectedDate, setSelectedDate] = useState<string | null>(() => dayjs().format("YYYY-MM-DD"));

  const { todos, form, subtaskDraft, setForm, setSubtaskDraft, handleSubmit, handleDelete, handleToggle, handleSubtaskToggle, handleReorder, addSubtaskDraft, removeSubtask, startEdit, resetForm } =
    useTodos();

  // 시계
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  const weekDays = useMemo(() => getCurrentWeek(currentTime).map((day) => day.add(weekOffset, "week")), [currentTime, weekOffset]);

  const filteredTodos = useMemo(() => {
    if (!selectedDate) return todos;
    return todos.filter((todo) => todo.date === selectedDate);
  }, [selectedDate, todos]);

  const selectedDateLabel = selectedDate ? dayjs(selectedDate).format("MM월 DD일") : "전체 일정";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 transition-colors dark:bg-zinc-950 dark:text-white sm:px-6 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Header theme={theme} toggleTheme={toggleTheme} selectedDateLabel={selectedDateLabel} currentTime={currentTime} />
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-semibold">Todo 작성</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-zinc-300">새로운 업무를 등록하거나 기존 업무를 편집하세요.</p>
              <TodoForm
                form={form}
                subtaskDraft={subtaskDraft}
                onChangeForm={setForm}
                onChangeSubtaskDraft={setSubtaskDraft}
                onAddSubtask={addSubtaskDraft}
                onRemoveSubtask={removeSubtask}
                onSubmit={handleSubmit}
                onReset={resetForm}
              />
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">오늘의 Todo</h2>
                  <p className="text-sm text-slate-500 dark:text-zinc-300">Drag & Drop으로 순서를 정리하세요.</p>
                </div>
                <span className="text-sm text-slate-400">총 {filteredTodos.length}건</span>
              </div>
              <TodoList
                todos={todos}
                filteredTodos={filteredTodos}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={startEdit}
                onSubtaskToggle={handleSubtaskToggle}
                onReorder={handleReorder}
              />
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <WeeklyView
                weekDays={weekDays}
                todos={todos}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                onShiftWeek={(direction) => setWeekOffset((prev) => (direction === "next" ? prev + 1 : prev - 1))}
              />
            </Card>
            <Card>
              <ProgressSnapshot todos={todos} />
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
