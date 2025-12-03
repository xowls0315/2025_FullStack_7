"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { createId } from "@/src/util/todoHelpers";
import type { Subtask, Todo, TodoFormState } from "@/src/features/todo/types";

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

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [form, setForm] = useState<TodoFormState>({
    id: "",
    title: "",
    description: "",
    date: dayjs().format("YYYY-MM-DD"),
    subtasks: [],
  });
  const [subtaskDraft, setSubtaskDraft] = useState("");

  // 초기 데이터 로딩
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

  const resetForm = () =>
    setForm({
      id: "",
      title: "",
      description: "",
      date: dayjs().format("YYYY-MM-DD"),
      subtasks: [],
    });

  // 📝 등록 / 수정
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const isEdit = Boolean(form.id);

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
      // 수정
      const targetId = form.id;

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
        setTodos((prev) => prev.map((todo) => (todo.id === targetId ? { ...todo, syncing: false } : todo)));
      } finally {
        resetForm();
      }
    } else {
      // 새로 등록
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

        setTodos((prev) => prev.map((todo) => (todo.id === tempId ? mapped : todo)));
      } catch (error) {
        console.error("POST /todos 에러:", error);
        setTodos((prev) => prev.filter((todo) => todo.id !== tempId));
      }
    }
  };

  // 🗑 삭제
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
      setTodos(snapshot);
    }
  };

  // 완료/미완료 토글
  const handleToggle = async (id: string) => {
    const original = todos.find((t) => t.id === id);
    if (!original) return;

    const nextCompleted = !original.completed;

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
      setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: original.completed, syncing: false } : todo)));
    }
  };

  // Subtask 토글
  const handleSubtaskToggle = (todoId: string, subId: string) => {
    const snapshot = todos;
    const target = snapshot.find((t) => t.id === todoId);
    if (!target) return;

    const nextSubtasks = target.subtasks.map((s) => (s.id === subId ? { ...s, completed: !s.completed } : s));

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
        setTodos(snapshot);
      }
    })();
  };

  // 정렬 (프론트 전용)
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

  // Subtask +/-
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

  return {
    todos,
    form,
    subtaskDraft,
    setForm,
    setSubtaskDraft,
    handleSubmit,
    handleDelete,
    handleToggle,
    handleSubtaskToggle,
    handleReorder,
    addSubtaskDraft,
    removeSubtask,
    startEdit,
    resetForm,
  };
}
