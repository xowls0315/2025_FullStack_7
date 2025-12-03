import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "t.jin_01's To-Do List",
  description: "Let's start your To-Do List",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-white">{children}</body>
    </html>
  );
}
