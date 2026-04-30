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
  pillClass: string;
  dotColor: string;
  barColor: string;
  badgeClass: string;
}

export const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  cutting: {
    label: "Cutting",
    pillClass: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    dotColor: "bg-blue-300",
    barColor: "bg-wm-blue",
    badgeClass: "bg-blue-500/20 text-blue-300",
  },
  forming: {
    label: "Forming",
    pillClass: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    dotColor: "bg-amber-300",
    barColor: "bg-amber-metal",
    badgeClass: "bg-amber-500/20 text-amber-300",
  },
  ready: {
    label: "Ready",
    pillClass: "bg-green-500/10 text-wm-green border-green-500/20",
    dotColor: "bg-wm-green",
    barColor: "bg-wm-green",
    badgeClass: "bg-green-500/20 text-wm-green",
  },
  queue: {
    label: "In Queue",
    pillClass: "bg-white/5 text-wm-text-dim border-white/10",
    dotColor: "bg-wm-text-dim",
    barColor: "bg-rust",
    badgeClass: "bg-white/10 text-wm-text-dim",
  },
  shipped: {
    label: "Shipped",
    pillClass: "bg-green-900/30 text-wm-green-dim border-green-900/20",
    dotColor: "bg-wm-green-dim",
    barColor: "bg-wm-green-dim",
    badgeClass: "bg-green-900/30 text-wm-green-dim",
  },
};
