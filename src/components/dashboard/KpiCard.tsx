"use client";

import { Card } from "@/components/ui/Card";


interface KpiCardProps {
  label: string;
  value: string | number;
  meta: string;
  accent: "orange" | "green" | "blue" | "amber";
  id?: string;
}

export function KpiCard({ label, value, meta, accent, id }: KpiCardProps) {
  return (
    <Card accent={accent} className="p-4 pt-5" id={id}>
      <div className="font-mono-custom text-[10px] tracking-[0.12em] text-wm-text-dim uppercase mb-1.5">
        {label}
      </div>
      <div className="font-head font-bold text-[30px] text-white leading-none">
        {value}
      </div>
      <div className="text-[11px] text-wm-text-dim mt-1">{meta}</div>
    </Card>
  );
}

export function KpiCardSkeleton() {
  return (
    <div className="bg-steel-mid border border-white/[0.07] rounded-sm p-4 pt-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 animate-shimmer" />
      <div className="h-2.5 w-24 animate-shimmer rounded mb-3" />
      <div className="h-8 w-12 animate-shimmer rounded mb-2" />
      <div className="h-2 w-32 animate-shimmer rounded" />
    </div>
  );
}
