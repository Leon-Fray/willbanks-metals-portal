"use client";

import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn, formatDate, formatDateFull } from "@/lib/utils";
import { MOCK_ORDERS, MOCK_HISTORY_ORDERS } from "@/lib/mock-data";
import { ArrowLeft } from "lucide-react";
import type { Order } from "@/lib/types";

export const ALL_ORDERS = [...MOCK_ORDERS, ...MOCK_HISTORY_ORDERS];

function getProcessSteps(process: string, status: string) {
  const baseSteps = ["Received", "Material Prep", process, "QC Inspection", "Ready for Pickup"];
  const doneMap: Record<string, number> = {
    queue: 1,
    cutting: 2,
    forming: 2,
    ready: 4,
    shipped: 5,
  };
  const doneCount = doneMap[status] ?? 1;
  return baseSteps.map((name, i) => ({
    name,
    done: i < doneCount,
    active: i === doneCount - 1 && status !== "shipped",
  }));
}

export function OrderDetailView({ order }: { order: Order }) {
  const steps = getProcessSteps(order.process, order.status);

  return (
    <div className="animate-fadeInUp max-w-4xl">
      <div className="mb-6">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 font-mono-custom text-[11px] text-wm-text-dim hover:text-rust transition-colors mb-4"
        >
          <ArrowLeft size={13} />
          Back to Active Orders
        </Link>
        <PageHeader
          title={order.order_number}
          subtitle={`// ${order.description}`}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {/* Info grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {[
              { label: "Status", value: <StatusPill status={order.status} /> },
              { label: "Process", value: order.process },
              { label: "Est. Ship", value: formatDate(order.est_ship_date) },
              { label: "Created", value: formatDateFull(order.created_at) },
              {
                label: "Progress",
                value: (
                  <div className="flex items-center gap-2">
                    <ProgressBar value={order.progress_pct} status={order.status} className="w-24" />
                    <span className="font-mono-custom text-[11px] text-wm-text-dim">
                      {order.progress_pct}%
                    </span>
                  </div>
                ),
              },
            ].map(({ label, value }) => (
              <div key={label} className="bg-black/20 rounded-sm p-3">
                <div className="font-mono-custom text-[9px] tracking-[0.15em] text-wm-text-dim uppercase mb-1">
                  {label}
                </div>
                <div className="text-[13px] font-medium text-white">{value}</div>
              </div>
            ))}
          </div>

          {/* Line Items */}
          {order.line_items && order.line_items.length > 0 && (
            <div className="bg-steel-mid border border-white/[0.07] rounded-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-white/[0.07]">
                <span className="font-head font-semibold text-[13px] tracking-[0.06em] uppercase">
                  Line Items
                </span>
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ background: "rgba(0,0,0,0.15)" }}>
                    {["Material", "Grade", "Thickness", "Qty", "Unit"].map((col) => (
                      <th
                        key={col}
                        className="font-mono-custom text-[10px] tracking-[0.12em] text-wm-text-dim uppercase px-5 py-2 text-left border-b border-white/[0.06]"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {order.line_items.map((item) => (
                    <tr key={item.id} className="border-b border-white/[0.04] last:border-0">
                      <td className="px-5 py-2.5 text-[13px]">{item.material}</td>
                      <td className="px-5 py-2.5 font-mono-custom text-[11px]">{item.grade}</td>
                      <td className="px-5 py-2.5 font-mono-custom text-[11px]">{item.thickness}</td>
                      <td className="px-5 py-2.5 font-mono-custom text-[11px]">{item.quantity}</td>
                      <td className="px-5 py-2.5 font-mono-custom text-[11px] text-wm-text-dim">{item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Process steps */}
        <div className="bg-steel-mid border border-white/[0.07] rounded-sm p-5">
          <div className="font-mono-custom text-[10px] tracking-[0.15em] text-wm-text-dim uppercase mb-4">
            Process Steps
          </div>
          <div className="space-y-0">
            {steps.map((step, i) => (
              <div key={step.name} className="flex gap-3.5">
                {/* Step indicator column */}
                <div className="flex flex-col items-center w-5 flex-shrink-0">
                  <div
                    className={cn(
                      "rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 w-[18px] h-[18px]",
                      step.done && !step.active
                        ? "bg-wm-green border-wm-green"
                        : step.active
                        ? "bg-rust border-rust animate-pulse-ring"
                        : "bg-steel border-white/15"
                    )}
                  >
                    {step.done && !step.active && (
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {step.active && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={cn(
                        "w-0.5 flex-1 my-1",
                        step.done ? "bg-wm-green-dim" : "bg-white/[0.08]"
                      )}
                      style={{ minHeight: "28px" }}
                    />
                  )}
                </div>

                {/* Step content */}
                <div className="pb-6 flex-1">
                  <div
                    className={cn(
                      "font-head font-semibold text-[13px] tracking-[0.05em]",
                      step.active
                        ? "text-rust-bright"
                        : step.done
                        ? "text-wm-green"
                        : "text-wm-text-dim"
                    )}
                  >
                    {step.name}
                  </div>
                  <div className="font-mono-custom text-[10px] text-wm-text-dim mt-0.5">
                    {step.done ? "Complete" : step.active ? "In progress" : "Pending"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
