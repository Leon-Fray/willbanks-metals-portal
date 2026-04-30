"use client";

import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  accent?: "orange" | "green" | "blue" | "amber" | "purple" | "none";
  id?: string;
}

const accentColors = {
  orange: "bg-rust",
  green: "bg-wm-green",
  blue: "bg-wm-blue",
  amber: "bg-amber-metal",
  purple: "bg-violet-500",
  none: "hidden",
};

export function Card({ children, className, accent = "none", id }: CardProps) {
  return (
    <div
      id={id}
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
