"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, action, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-end justify-between mb-7 pb-4 border-b border-white/[0.07]",
        className
      )}
    >
      <div>
        <h1 className="font-head font-bold text-[28px] tracking-[0.05em] uppercase text-white leading-none">
          {title}
        </h1>
        {subtitle && (
          <p className="font-mono-custom text-[12px] text-wm-text-dim mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
