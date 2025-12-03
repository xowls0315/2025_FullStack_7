"use client";

import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { Card } from "@/src/components/Card";
import { useTheme } from "@/src/features/theme/useTheme";
import type { Subtask, Todo } from "@/src/features/todo/types";
import { Header } from "@/src/features/layout/Header";
import { TodoForm } from "@/src/features/todo/TodoForm";
import { WeeklyView } from "@/src/features/dashboard/WeeklyView";
import { ProgressSnapshot } from "@/src/features/dashboard/ProgressSnapshot";
import { createId, getCurrentWeek } from "@/src/util/todoHelpers";

const TodoList = dynamic(() => import("@/src/features/todo/TodoList").then((mod) => mod.TodoList), { ssr: false });

// 백엔드 주소 (필요하면 .env에 NEXT_PUBLIC_API_URL로 빼도 됨)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type ApiSubtask = {
  id: number;
  title: string;
  completed: boolean;
};

type ApiTodo = {
  id: number;
  title: string;
  description: string | null;
  date: string; // ISO
  completed: boolean;
  subtasks: ApiSubtask[];
};

function mapApiTodo(todo: ApiTodo): Todo {
  return {
    id: String(todo.id),
    title: todo.title,
    description: todo.description ?? "",
    date: dayjs(todo.date).format("YYYY-MM-DD"),
    completed: todo.completed,
    subtasks: (todo.subtasks ?? []).map((s) => ({
      id: String(s.id),
      title: s.title,
      completed: s.completed,
    })),
    syncing: false,
  };
}

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 🔹 이제는 DB에서 가져오므로 초기값은 빈 배열
  const [todos, setTodos] = useState<Todo[]>([]);

  const [form, setForm] = useState({
    id: "", // 수정 시에만 사용 (문자열 id)
    title: "",
    description: "",
    date: dayjs().format("YYYY-MM-DD"),
    subtasks: [] as Subtask[],
  });
  const [subtaskDraft, setSubtaskDraft] = useState("");

  // ⏱ 시계
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🔄 최초 마운트 시 DB에서 todos 가져오기
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/todos`);
        if (!res.ok) {
          throw new Error("Failed to fetch todos");
        }
        const data: ApiTodo[] = await res.json();
        setTodos(data.map(mapApiTodo));
      } catch (error) {
        console.error("GET /todos 실패:", error);
      }
    };

    fetchTodos();
  }, []);

  const weekDays = useMemo(() => getCurrentWeek(currentTime).map((day) => day.add(weekOffset, "week")), [currentTime, weekOffset]);

  const filteredTodos = useMemo(() => {
    if (!selectedDate) return todos;
    return todos.filter((todo) => todo.date === selectedDate);
  }, [selectedDate, todos]);

  const selectedDateLabel = selectedDate ? dayjs(selectedDate).format("MM월 DD일") : "전체 일정";

  const resetForm = () =>
    setForm({
      id: "",
      title: "",
      description: "",
      date: dayjs().format("YYYY-MM-DD"),
      subtasks: [],
    });

  // 📝 등록 / 수정 (POST / PUT)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const isEdit = Boolean(form.id);

    // 서버에 보낼 payload (syncing, id 등 프론트 전용은 보내지 않음)
    const basePayload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      date: form.date,
      subtasks: form.subtasks.map((s) => ({
        title: s.title,
        completed: s.completed,
      })),
    };

    if (isEdit) {
      // ✅ 수정: PUT /todos/:id
      const targetId = form.id;

      // Optimistic UI: 먼저 로컬 상태 업데이트 + syncing 표시
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === targetId
            ? {
                ...todo,
                title: form.title,
                description: form.description,
                date: form.date,
                subtasks: form.subtasks,
                syncing: true,
              }
            : todo
        )
      );

      try {
        const res = await fetch(`${API_BASE_URL}/todos/${Number(targetId)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(basePayload),
        });
        if (!res.ok) {
          throw new Error("PUT /todos 실패");
        }
        const updated: ApiTodo = await res.json();

        setTodos((prev) => prev.map((todo) => (todo.id === targetId ? mapApiTodo(updated) : todo)));
      } catch (error) {
        console.error("PUT /todos 에러:", error);
        // 실패 시 syncing만 끄기 (혹은 토스트 띄우는 식으로 처리)
        setTodos((prev) => prev.map((todo) => (todo.id === targetId ? { ...todo, syncing: false } : todo)));
      } finally {
        resetForm();
      }
    } else {
      // ✅ 새로 등록: POST /todos
      const tempId = createId();

      const optimisticTodo: Todo = {
        id: tempId,
        title: basePayload.title,
        description: (basePayload.description as string) ?? "",
        date: basePayload.date,
        completed: false,
        subtasks: form.subtasks,
        syncing: true,
      };

      // 먼저 화면에 반영
      setTodos((prev) => [optimisticTodo, ...prev]);
      resetForm();

      try {
        const res = await fetch(`${API_BASE_URL}/todos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...basePayload, completed: false }),
        });
        if (!res.ok) {
          throw new Error("POST /todos 실패");
        }
        const created: ApiTodo = await res.json();
        const mapped = mapApiTodo(created);

        // 임시 todo(tempId)를 서버에서 돌아온 todo로 교체
        setTodos((prev) => prev.map((todo) => (todo.id === tempId ? mapped : todo)));
      } catch (error) {
        console.error("POST /todos 에러:", error);
        // 실패하면 임시 todo 제거
        setTodos((prev) => prev.filter((todo) => todo.id !== tempId));
      }
    }
  };

  // 🗑 삭제 (DELETE /todos/:id)
  const handleDelete = async (id: string) => {
    const snapshot = todos;
    setTodos((prev) => prev.filter((todo) => todo.id !== id));

    try {
      const res = await fetch(`${API_BASE_URL}/todos/${Number(id)}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) {
        throw new Error("DELETE /todos 실패");
      }
    } catch (error) {
      console.error("DELETE /todos 에러:", error);
      // 실패하면 롤백
      setTodos(snapshot);
    }
  };

  // ✅ 완료/미완료 토글 (PUT /todos/:id, completed만 수정)
  const handleToggle = async (id: string) => {
    const original = todos.find((t) => t.id === id);
    if (!original) return;

    const nextCompleted = !original.completed;

    // optimistic
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: nextCompleted, syncing: true } : todo)));

    try {
      const res = await fetch(`${API_BASE_URL}/todos/${Number(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: nextCompleted }),
      });
      if (!res.ok) {
        throw new Error("PUT /todos (toggle) 실패");
      }
      const updated: ApiTodo = await res.json();
      setTodos((prev) => prev.map((todo) => (todo.id === id ? mapApiTodo(updated) : todo)));
    } catch (error) {
      console.error("toggle 에러:", error);
      // 실패 시 원래 값으로 롤백
      setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: original.completed, syncing: false } : todo)));
    }
  };

  // ✅ Subtask 토글 (PUT /todos/:id, subtasks 전체 재전송)
  const handleSubtaskToggle = (todoId: string, subId: string) => {
    const snapshot = todos;
    const target = snapshot.find((t) => t.id === todoId);
    if (!target) return;

    const nextSubtasks = target.subtasks.map((s) => (s.id === subId ? { ...s, completed: !s.completed } : s));

    // optimistic UI
    setTodos((prev) => prev.map((todo) => (todo.id === todoId ? { ...todo, subtasks: nextSubtasks } : todo)));

    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/todos/${Number(todoId)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subtasks: nextSubtasks.map((s) => ({
              title: s.title,
              completed: s.completed,
            })),
          }),
        });
        if (!res.ok) {
          throw new Error("PUT /todos (subtasks) 실패");
        }
        const updated: ApiTodo = await res.json();
        setTodos((prev) => prev.map((todo) => (todo.id === todoId ? mapApiTodo(updated) : todo)));
      } catch (error) {
        console.error("subtask toggle 에러:", error);
        setTodos(snapshot); // 실패 시 롤백
      }
    })();
  };

  // 정렬은 프론트에서만 관리 (DB와 동기화 X)
  const handleReorder = (activeId: string | number, overId: string | number) => {
    setTodos((prev) => {
      const oldIndex = prev.findIndex((todo) => todo.id === activeId);
      const newIndex = prev.findIndex((todo) => todo.id === overId);
      if (oldIndex === -1 || newIndex === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, moved);
      return next;
    });
  };

  // Subtask 추가/삭제 (폼 내부)
  const addSubtaskDraft = () => {
    if (!subtaskDraft.trim()) return;
    const newSubtask: Subtask = {
      id: createId(),
      title: subtaskDraft.trim(),
      completed: false,
    };
    setForm((prev) => ({
      ...prev,
      subtasks: [...prev.subtasks, newSubtask],
    }));
    setSubtaskDraft("");
  };

  const removeSubtask = (id: string) => {
    setForm((prev) => ({
      ...prev,
      subtasks: prev.subtasks.filter((subtask) => subtask.id !== id),
    }));
  };

  const startEdit = (todo: Todo) => {
    setForm({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      date: todo.date,
      subtasks: todo.subtasks,
    });
  };

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
