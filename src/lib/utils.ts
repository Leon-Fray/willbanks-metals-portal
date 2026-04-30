import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { OrderStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatDateFull(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHrs = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffHrs < 1) return "Just now";
  if (diffHrs < 24) {
    const hrs = Math.floor(diffHrs);
    const mins = Math.floor((diffHrs - hrs) * 60);
    if (hrs === 0) return `${mins}m ago`;
    return `Today, ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
  }
  if (diffDays < 2) {
    return `Yesterday, ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
  }
  return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
}

export function daysUntil(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export interface StatusConfig {
  label: string;
  /** Raw CSS color for text */
  color: string;
  /** Raw CSS color for background (pill/badge) */
  bgColor: string;
  /** Raw CSS color for border */
  borderColor: string;
  /** Raw CSS color for the dot and progress bar */
  accentColor: string;
  // Legacy Tailwind classes kept for any other usages
  pillClass: string;
  dotColor: string;
  barColor: string;
  badgeClass: string;
}

export const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  cutting: {
    label: "Cutting",
    color: "#5eead4",          // teal-300
    bgColor: "rgba(20,184,166,0.12)",
    borderColor: "rgba(20,184,166,0.30)",
    accentColor: "#2dd4bf",    // teal-400
    pillClass: "",
    dotColor: "",
    barColor: "",
    badgeClass: "",
  },
  forming: {
    label: "Forming",
    color: "#fcd34d",          // amber-300
    bgColor: "rgba(245,158,11,0.10)",
    borderColor: "rgba(245,158,11,0.25)",
    accentColor: "#d4922a",    // amber-metal
    pillClass: "",
    dotColor: "",
    barColor: "",
    badgeClass: "",
  },
  ready: {
    label: "Ready",
    color: "#2db87d",          // wm-green
    bgColor: "rgba(45,184,125,0.10)",
    borderColor: "rgba(45,184,125,0.25)",
    accentColor: "#2db87d",
    pillClass: "",
    dotColor: "",
    barColor: "",
    badgeClass: "",
  },
  queue: {
    label: "In Queue",
    color: "#c4b5fd",          // purple-300
    bgColor: "rgba(139,92,246,0.12)",
    borderColor: "rgba(139,92,246,0.30)",
    accentColor: "#a78bfa",    // purple-400
    pillClass: "",
    dotColor: "",
    barColor: "",
    badgeClass: "",
  },
  shipped: {
    label: "Shipped",
    color: "#1a7a52",          // wm-green-dim
    bgColor: "rgba(26,122,82,0.20)",
    borderColor: "rgba(26,122,82,0.20)",
    accentColor: "#1a7a52",
    pillClass: "",
    dotColor: "",
    barColor: "",
    badgeClass: "",
  },
};
