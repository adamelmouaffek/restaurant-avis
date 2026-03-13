"use client";

import { useState, useEffect } from "react";

interface KDSTimerBadgeProps {
  createdAt: string;
  priority: "normal" | "rush" | "vip";
}

function getElapsedMinutes(createdAt: string): number {
  return (Date.now() - new Date(createdAt).getTime()) / 60_000;
}

function formatElapsed(minutes: number): string {
  const m = Math.floor(minutes);
  if (m < 1) return "<1 min";
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return `${h}h${String(rest).padStart(2, "0")}`;
}

/**
 * Thresholds in minutes for color changes.
 * normal: green(<5), yellow(5-10), orange(10-15), red(>15)
 * rush/vip: green(<3), yellow(3-5), orange(5-8), red(>10)
 */
function getTimerColor(minutes: number, priority: "normal" | "rush" | "vip"): string {
  if (priority === "normal") {
    if (minutes < 5) return "bg-green-500/20 text-green-300 border-green-500/40";
    if (minutes < 10) return "bg-yellow-500/20 text-yellow-300 border-yellow-500/40";
    if (minutes < 15) return "bg-orange-500/20 text-orange-300 border-orange-500/40";
    return "bg-red-500/20 text-red-300 border-red-500/40 animate-pulse";
  }
  // rush or vip
  if (minutes < 3) return "bg-green-500/20 text-green-300 border-green-500/40";
  if (minutes < 5) return "bg-yellow-500/20 text-yellow-300 border-yellow-500/40";
  if (minutes < 8) return "bg-orange-500/20 text-orange-300 border-orange-500/40";
  return "bg-red-500/20 text-red-300 border-red-500/40 animate-pulse";
}

export function KDSTimerBadge({ createdAt, priority }: KDSTimerBadgeProps) {
  const [minutes, setMinutes] = useState(() => getElapsedMinutes(createdAt));

  useEffect(() => {
    // Update every 30 seconds
    const id = setInterval(() => {
      setMinutes(getElapsedMinutes(createdAt));
    }, 30_000);
    return () => clearInterval(id);
  }, [createdAt]);

  const colorClasses = getTimerColor(minutes, priority);

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${colorClasses}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-3 h-3"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      {formatElapsed(minutes)}
    </span>
  );
}
