"use client";

import { cn, STATUS_CONFIG } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

interface ProgressBarProps {
  value: number; // 0–100
  status?: OrderStatus;
  className?: string;
}

export function ProgressBar({ value, status = "queue", className }: ProgressBarProps) {
  const config = STATUS_CONFIG[status];
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("w-20 h-1 bg-white/10 rounded-full overflow-hidden", className)}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${clamped}%`,
          backgroundColor: config.accentColor,
        }}
      />
    </div>
  );
}
