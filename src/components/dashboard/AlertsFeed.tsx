"use client";

import { useState } from "react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { AlertSkeleton } from "@/components/ui/Skeleton";

import { toast } from "sonner";
import type { Alert } from "@/lib/types";

interface AlertsFeedProps {
  alerts: Alert[];
  loading?: boolean;
  showActions?: boolean;
}

const severityDot: Record<string, string> = {
  info: "bg-wm-green",
  warning: "bg-amber-metal",
  action: "bg-rust",
};

export function AlertsFeed({ alerts, loading = false, showActions = false }: AlertsFeedProps) {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const handleMarkRead = (id: string) => {
    // Optimistic update
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    toast.success("Alert dismissed");
  };

  return (
    <div className="bg-steel-mid border border-white/[0.07] rounded-sm overflow-hidden" id="alerts-feed">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.07]">
        <span className="font-head font-semibold text-[14px] tracking-[0.06em] uppercase text-wm-text">
          Recent Alerts
        </span>
      </div>

      {loading ? (
        <>
          <AlertSkeleton />
          <AlertSkeleton />
          <AlertSkeleton />
        </>
      ) : alerts.length === 0 ? (
        <div className="px-5 py-8 text-center text-wm-text-dim font-mono-custom text-[12px]">
          No active alerts.
        </div>
      ) : (
        alerts.map((alert) => {
          const isRead = readIds.has(alert.id) || !!alert.read_at;
          return (
            <div
              key={alert.id}
              className={cn(
                "flex items-start gap-3 px-5 py-3.5 border-b border-white/[0.04] last:border-0 transition-opacity duration-300",
                isRead && "opacity-40"
              )}
            >
              <div
                className={cn(
                  "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                  severityDot[alert.severity] ?? "bg-wm-text-dim"
                )}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-wm-text leading-relaxed">{alert.message}</p>
                <p className="font-mono-custom text-[10px] text-wm-text-dim mt-0.5">
                  {formatRelativeTime(alert.created_at)}
                </p>
              </div>
              {showActions && !isRead && (
                <button
                  onClick={() => handleMarkRead(alert.id)}
                  className="text-[10px] font-mono-custom text-wm-text-dim hover:text-rust transition-colors flex-shrink-0 mt-0.5"
                >
                  Dismiss
                </button>
              )}
              {!showActions && !isRead && (
                <button
                  onClick={() => handleMarkRead(alert.id)}
                  className="text-[10px] font-mono-custom text-wm-text-dim hover:text-rust transition-colors flex-shrink-0 mt-0.5"
                  title="Mark as read"
                >
                  ✕
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
