import type dayjs from "dayjs";
import type { Theme } from "@/src/features/theme/useTheme";

type HeaderProps = {
  theme: Theme;
  toggleTheme: () => void;
  selectedDateLabel: string;
  currentTime: dayjs.Dayjs;
};

export const Header = ({ theme, toggleTheme, selectedDateLabel, currentTime }: HeaderProps) => {
  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-black/5 bg-linear-to-r from-slate-900 via-slate-800 to-indigo-900 p-8 text-white shadow-2xl shadow-indigo-500/20 dark:from-black dark:via-zinc-900 dark:to-indigo-900">
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-3xl font-semibold">To-Do List</h1>
        <span className="rounded-full bg-white/10 px-4 py-1 text-sm">{selectedDateLabel}</span>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-white/60">Black · White</span>
          <button onClick={toggleTheme} className="flex items-center rounded-full bg-white/10 px-1 py-1 text-xs font-semibold backdrop-blur transition hover:bg-white/20">
            <span className={`rounded-full px-3 py-1 text-neutral-900 transition ${theme === "light" ? "bg-white text-neutral-900" : "bg-zinc-800 text-white"}`}>
              {theme === "light" ? "Light" : "Dark"}
            </span>
          </button>
        </div>
      </div>
      <div className="text-5xl font-semibold tracking-tight">{currentTime.format("HH:mm:ss")}</div>
      <p className="text-white/70">{currentTime.format("YYYY년 MM월 DD일 dddd")}</p>
    </header>
  );
};
