"use client";

import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "todo-theme";

export function useTheme() {
  // SSR + 첫 렌더는 무조건 light
  const [theme, setTheme] = useState<Theme>("light");

  // 클라이언트에서만 localStorage / 시스템 다크 모드 읽어서 초기값 설정
  useEffect(() => {
    if (typeof window === "undefined") return;

    let nextTheme: Theme = "light";

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      nextTheme = stored;
    } else {
      const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
      nextTheme = prefersDark ? "dark" : "light";
    }

    // ✅ 초기값(light)와 다를 때만, 그리고 한 틱 뒤에 setTheme 호출
    if (nextTheme !== "light") {
      setTimeout(() => {
        setTheme(nextTheme);
      }, 0);
    }
  }, []);

  // theme가 바뀔 때마다 <html class="dark"> 토글 + localStorage 저장
  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme };
}
