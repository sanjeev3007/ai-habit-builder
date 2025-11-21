import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Habit Builder - Transform Goals into 30-Day Habit Plans",
  description: "Get a personalized habit roadmap with daily tasks, weekly checkpoints, streak tracking, and daily motivation — all powered by AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
