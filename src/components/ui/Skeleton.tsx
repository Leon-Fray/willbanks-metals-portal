"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-sm",
        className
      )}
    />
  );
}

export function KpiCardSkeleton() {
  return (
    <div className="bg-steel-mid border border-white/[0.07] rounded-sm p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 animate-shimmer" />
      <Skeleton className="h-3 w-24 mb-3" />
      <Skeleton className="h-8 w-12 mb-2" />
      <Skeleton className="h-2.5 w-32" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 6 }: { cols?: number }) {
  return (
    <tr className="border-b border-white/[0.04]">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-3">
          <Skeleton className={cn("h-3", i === 0 ? "w-20" : i === 1 ? "w-40" : "w-16")} />
        </td>
      ))}
    </tr>
  );
}

export function AlertSkeleton() {
  return (
    <div className="flex gap-3 px-5 py-3 border-b border-white/[0.04]">
      <Skeleton className="w-2 h-2 rounded-full mt-1 flex-shrink-0" />
      <div className="flex-1">
        <Skeleton className="h-3 w-3/4 mb-2" />
        <Skeleton className="h-2.5 w-24" />
      </div>
    </div>
  );
}
