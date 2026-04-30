"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { cn, formatDateFull, formatCurrency, daysUntil } from "@/lib/utils";
import { MOCK_QUOTES } from "@/lib/mock-data";
import { toast } from "sonner";
import type { Quote } from "@/lib/types";

const statusStyle: Record<Quote["status"], string> = {
  open: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  accepted: "bg-wm-green/10 text-wm-green border-wm-green/20",
  expired: "bg-white/5 text-wm-text-dim border-white/10",
  extended: "bg-wm-blue/10 text-wm-blue border-wm-blue/20",
};

const statusLabel: Record<Quote["status"], string> = {
  open: "Open",
  accepted: "Accepted",
  expired: "Expired",
  extended: "Extended",
};

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>(MOCK_QUOTES);

  const handleAccept = (id: string) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: "accepted" as const } : q))
    );
    toast.success("Quote accepted! We'll be in touch shortly.");
  };

  const handleExtend = (id: string) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: "extended" as const } : q))
    );
    toast.info("Extension request sent.");
  };

  const openQuotes = quotes.filter((q) => q.status === "open");
  const pastQuotes = quotes.filter((q) => q.status !== "open");

  return (
    <div className="animate-fadeInUp">
      <PageHeader
        title="Quotes"
        subtitle={`// ${openQuotes.length} open quote${openQuotes.length !== 1 ? "s" : ""}`}
      />

      {/* Open Quotes */}
      {openQuotes.length > 0 && (
        <div className="mb-6">
          <div className="font-mono-custom text-[10px] tracking-[0.15em] text-wm-text-dim uppercase mb-3">
            Open Quotes
          </div>
          <div className="space-y-3">
            {openQuotes.map((quote) => {
              const days = daysUntil(quote.expires_at);
              const isUrgent = days <= 5;
              return (
                <div
                  key={quote.id}
                  className="bg-steel-mid border border-white/[0.07] rounded-sm p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono-custom text-[13px] text-rust-bright font-medium">
                          {quote.quote_number}
                        </span>
                        <span
                          className={cn(
                            "font-mono-custom text-[9px] tracking-widest uppercase px-1.5 py-0.5 rounded-sm border",
                            statusStyle[quote.status]
                          )}
                        >
                          {statusLabel[quote.status]}
                        </span>
                      </div>
                      <p className="text-[13px] text-wm-text mb-1">{quote.description}</p>
                      <p
                        className={cn(
                          "font-mono-custom text-[11px]",
                          isUrgent ? "text-amber-300" : "text-wm-text-dim"
                        )}
                      >
                        Expires {formatDateFull(quote.expires_at)}
                        {isUrgent && ` · ${days} day${days !== 1 ? "s" : ""} remaining`}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-head font-bold text-[22px] text-amber-metal mb-3">
                        {formatCurrency(quote.total_amount)}
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleAccept(quote.id)}
                          id={`accept-quote-${quote.id}`}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleExtend(quote.id)}
                          id={`extend-quote-${quote.id}`}
                        >
                          Request Extension
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Past Quotes */}
      <div>
        <div className="font-mono-custom text-[10px] tracking-[0.15em] text-wm-text-dim uppercase mb-3">
          Quote History
        </div>
        <div className="bg-steel-mid border border-white/[0.07] rounded-sm overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.15)" }}>
                {["Quote #", "Description", "Amount", "Expires", "Status"].map((col) => (
                  <th
                    key={col}
                    className="font-mono-custom text-[10px] tracking-[0.12em] text-wm-text-dim uppercase px-5 py-2.5 text-left border-b border-white/[0.06]"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pastQuotes.map((quote) => (
                <tr
                  key={quote.id}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors last:border-0"
                >
                  <td className="px-5 py-3 font-mono-custom text-[12px] text-rust-bright">
                    {quote.quote_number}
                  </td>
                  <td className="px-5 py-3 text-[13px] text-wm-text">{quote.description}</td>
                  <td className="px-5 py-3 font-head text-[16px] text-amber-metal">
                    {formatCurrency(quote.total_amount)}
                  </td>
                  <td className="px-5 py-3 font-mono-custom text-[11px] text-wm-text-dim">
                    {formatDateFull(quote.expires_at)}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "font-mono-custom text-[9px] tracking-widest uppercase px-1.5 py-0.5 rounded-sm border",
                        statusStyle[quote.status]
                      )}
                    >
                      {statusLabel[quote.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
