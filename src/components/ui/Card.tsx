"use client";

import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  accent?: "orange" | "green" | "blue" | "amber" | "none";
}

const accentColors = {
  orange: "bg-rust",
  green: "bg-wm-green",
  blue: "bg-wm-blue",
  amber: "bg-amber-metal",
  none: "hidden",
};

export function Card({ children, className, accent = "none" }: CardProps) {
  return (
    <div
      className={cn(
        "relative bg-steel-mid border border-white/[0.07] rounded-sm overflow-hidden",
        className
      )}
    >
      {accent !== "none" && (
        <div className={cn("absolute top-0 left-0 right-0 h-0.5", accentColors[accent])} />
      )}
      {children}
    </div>
  );
}
