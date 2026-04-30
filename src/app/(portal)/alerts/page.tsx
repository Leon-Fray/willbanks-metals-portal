"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";

import { MOCK_ALERTS } from "@/lib/mock-data";
import { cn, formatRelativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import type { Alert } from "@/lib/types";

const severityDot: Record<string, string> = {
  info: "bg-wm-green",
  warning: "bg-amber-metal",
  action: "bg-rust",
};

const severityLabel: Record<string, string> = {
  info: "Info",
  warning: "Warning",
  action: "Action Required",
};

export default function AlertsPage() {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [alerts] = useState<Alert[]>(MOCK_ALERTS);

  const handleMarkRead = (id: string) => {
    // Optimistic update
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    toast.success("Alert marked as read");
  };

  const handleMarkAllRead = () => {
    setReadIds(new Set(alerts.map((a) => a.id)));
    toast.success("All alerts dismissed");
  };

  const unreadCount = alerts.filter((a) => !readIds.has(a.id) && !a.read_at).length;

  return (
    <div className="animate-fadeInUp">
      <PageHeader
        title="Alerts"
        subtitle={`// ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`}
        action={
          unreadCount > 0 ? (
            <Button variant="ghost" size="sm" onClick={handleMarkAllRead} id="dismiss-all-btn">
              Dismiss All
            </Button>
          ) : undefined
        }
      />

      <div className="bg-steel-mid border border-white/[0.07] rounded-sm overflow-hidden">
        {alerts.length === 0 ? (
          <div className="px-5 py-12 text-center text-wm-text-dim font-mono-custom text-[12px]">
            No alerts at this time.
          </div>
        ) : (
          alerts.map((alert) => {
            const isRead = readIds.has(alert.id) || !!alert.read_at;
            return (
              <div
                key={alert.id}
                className={cn(
                  "flex items-start gap-3 px-5 py-4 border-b border-white/[0.04] last:border-0 transition-all duration-300",
                  isRead && "opacity-40"
                )}
              >
                {/* Dot */}
                <div
                  className={cn(
                    "w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0",
                    severityDot[alert.severity] ?? "bg-wm-text-dim"
                  )}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-[13px] text-wm-text leading-relaxed">
                      {alert.message}
                    </p>
                    <span
                      className={cn(
                        "font-mono-custom text-[9px] tracking-widest uppercase px-1.5 py-0.5 rounded-sm flex-shrink-0",
                        alert.severity === "info" && "bg-wm-green/10 text-wm-green",
                        alert.severity === "warning" && "bg-amber-500/10 text-amber-300",
                        alert.severity === "action" && "bg-rust/10 text-rust-bright"
                      )}
                    >
                      {severityLabel[alert.severity]}
                    </span>
                  </div>
                  <p className="font-mono-custom text-[10px] text-wm-text-dim mt-1">
                    {formatRelativeTime(alert.created_at)}
                  </p>

                  {/* Action buttons */}
                  {!isRead && (
                    <div className="flex gap-2 mt-3">
                      {alert.severity === "info" && (
                        <Button size="sm" variant="ghost" onClick={() => handleMarkRead(alert.id)}>
                          Confirm Pickup
                        </Button>
                      )}
                      {alert.severity === "warning" && (
                        <>
                          <Button size="sm" variant="primary" onClick={() => {
                            handleMarkRead(alert.id);
                            toast.success("Quote accepted");
                          }}>
                            Accept Quote
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => {
                            handleMarkRead(alert.id);
                            toast.info("Extension requested");
                          }}>
                            Request Extension
                          </Button>
                        </>
                      )}
                      {alert.severity === "action" && (
                        <>
                          <Button size="sm" variant="primary" onClick={() => {
                            handleMarkRead(alert.id);
                            toast.success("Mill cert request sent");
                          }}>
                            Yes, send cert
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleMarkRead(alert.id)}>
                            No need
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
