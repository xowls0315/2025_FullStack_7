import dayjs from "dayjs";
import type { Todo } from "@/src/features/todo/types";

export const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

export const optimisticSleep = (ms = 450) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

export const getCurrentWeek = (reference: dayjs.Dayjs = dayjs()) => {
  const mondayOffset = (reference.day() + 6) % 7;
  const monday = reference.subtract(mondayOffset, "day");
  return Array.from({ length: 7 }, (_, idx) => monday.add(idx, "day"));
};

export const calculateProgress = (todos: Todo[]) => {
  if (todos.length === 0) return 0;
  const done = todos.filter((todo) => todo.completed).length;
  return Math.round((done / todos.length) * 100);
};


