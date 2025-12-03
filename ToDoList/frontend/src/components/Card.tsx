import type { PropsWithChildren } from "react";

export const Card = ({ children }: PropsWithChildren) => (
  <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-lg shadow-black/5 dark:border-white/5 dark:bg-zinc-900/60 dark:shadow-white/5">
    {children}
  </section>
);


