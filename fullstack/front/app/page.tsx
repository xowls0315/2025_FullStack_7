"use client";

import { useEffect, useState } from "react";

type Food = "jajangmyeon" | "tangsuyuk" | "mandu";

const API_BASE_URL = "http://localhost:3000";

type FoodState = {
  count: number;
  loading: boolean;
};

export default function Home() {
  const [foods, setFoods] = useState<Record<Food, FoodState>>({
    jajangmyeon: { count: 0, loading: false },
    tangsuyuk: { count: 0, loading: false },
    mandu: { count: 0, loading: false },
  });

  const [message, setMessage] = useState("");

  const callApi = async (food: Food, method: "GET" | "POST") => {
    try {
      setFoods((prev) => ({
        ...prev,
        [food]: { ...prev[food], loading: true },
      }));

      const res = await fetch(`${API_BASE_URL}/${food}`, { method });

      if (!res.ok) {
        throw new Error("API 실패");
      }

      const data = await res.json();

      setFoods((prev) => ({
        ...prev,
        [food]: { ...prev[food], count: data.count, loading: false },
      }));

      setMessage(data.message);
    } catch (err) {
      console.error(err);
      setMessage("요청 실패!");

      setFoods((prev) => ({
        ...prev,
        [food]: { ...prev[food], loading: false },
      }));
    }
  };

  // ⭐ 페이지 로드 시 딱 1번 실행
  useEffect(() => {
    callApi("jajangmyeon", "GET");
    callApi("tangsuyuk", "GET");
    callApi("mandu", "GET");
  }, []);

  const renderFoodCard = (food: Food, label: string, emoji: string) => {
    const state = foods[food];

    return (
      <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <h2 className="text-lg font-semibold">{label}</h2>
        </div>

        <p className="mb-3 text-sm text-slate-600">
          지금까지 <span className="font-bold text-rose-500">{state.count}</span> 번 먹었습니다.
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => callApi(food, "GET")}
            disabled={state.loading}
            className="flex-1 min-w-[120px] rounded-full border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 shadow-sm transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {state.loading ? "불러오는 중..." : "GET · 갯수 조회"}
          </button>
          <button
            onClick={() => callApi(food, "POST")}
            disabled={state.loading}
            className="flex-1 min-w-[120px] rounded-full bg-gradient-to-r from-rose-400 to-amber-400 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:from-rose-500 hover:to-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {state.loading ? "요청 중..." : "POST · 1개 먹기 (+1)"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffe4c4,_#fff8f0)] px-4 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
        <header className="mb-6">
          <h1 className="bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-3xl font-extrabold text-transparent">🍜 Food 카운터</h1>
          <p className="mt-1 text-sm text-slate-600">
            아래 버튼을 눌러서 <span className="font-semibold">Express 백엔드 API</span>를 호출해 보세요.
          </p>
        </header>

        <section className="mb-6 grid gap-4 md:grid-cols-3">
          {renderFoodCard("jajangmyeon", "짜장면", "🍜")}
          {renderFoodCard("tangsuyuk", "탕수육", "🥠")}
          {renderFoodCard("mandu", "만두", "🥟")}
        </section>

        <section className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/80 p-4 text-sm text-slate-700">
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-700">최근 응답 메시지</h3>
          <p>{message || "아직 요청 전입니다."}</p>
        </section>
      </div>
    </main>
  );
}
