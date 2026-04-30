"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  count: number;
  className?: string;
}

export function Badge({ count, className }: BadgeProps) {
  if (count === 0) return null;
  return (
    <span
      className={cn(
        "ml-auto bg-rust text-white font-mono-custom text-[10px] px-1.5 py-px rounded-full leading-none",
        className
      )}
    >
      {count}
    </span>
  );
}
