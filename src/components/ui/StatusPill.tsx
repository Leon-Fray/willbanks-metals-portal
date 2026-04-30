"use client";

import { cn } from "@/lib/utils";
import { STATUS_CONFIG } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

interface StatusPillProps {
  status: OrderStatus;
  className?: string;
}

export function StatusPill({ status, className }: StatusPillProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border text-[10px] tracking-[0.05em]",
        "font-mono-custom",
        className
      )}
      style={{
        color: config.color,
        backgroundColor: config.bgColor,
        borderColor: config.borderColor,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: config.accentColor }}
      />
      {config.label}
    </span>
  );
}
