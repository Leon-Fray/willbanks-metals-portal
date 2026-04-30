"use client";

import { useState } from "react";
import Link from "next/link";
import { StatusPill } from "@/components/ui/StatusPill";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { cn, formatDate } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/types";

type FilterTab = "all" | "floor" | "ready";

interface ActiveOrdersTableProps {
  orders: Order[];
  loading?: boolean;
  showFilters?: boolean;
  extraFilters?: boolean; // shows Cutting/Forming filters too
}

const FLOOR_STATUSES: OrderStatus[] = ["cutting", "forming"];

export function ActiveOrdersTable({
  orders,
  loading = false,
  showFilters = true,

}: ActiveOrdersTableProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const filtered = orders.filter((o) => {
    if (activeTab === "floor") return FLOOR_STATUSES.includes(o.status);
    if (activeTab === "ready") return o.status === "ready";
    return true;
  });

  return (
    <div
      className="bg-steel-mid border border-white/[0.07] rounded-sm overflow-hidden"
      id="active-orders-table"
    >
      {/* Table header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.07]">
        <span className="font-head font-semibold text-[14px] tracking-[0.06em] uppercase text-wm-text">
          Active Orders
        </span>
        {showFilters && (
          <div className="flex gap-2">
            {(["all", "floor", "ready"] as FilterTab[]).map((tab) => (
              <button
                key={tab}
                id={`filter-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "font-mono-custom text-[10px] tracking-[0.08em] px-2.5 py-1 rounded-sm border transition-all duration-150",
                  activeTab === tab
                    ? "bg-rust border-rust text-white"
                    : "bg-transparent border-white/15 text-wm-text-dim hover:border-rust/50 hover:text-wm-text"
                )}
              >
                {tab === "all" ? "All" : tab === "floor" ? "On Floor" : "Ready"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ background: "rgba(0,0,0,0.15)" }}>
              {["Order ID", "Description", "Process", "Status", "Progress", "Est. Ship"].map(
                (col) => (
                  <th
                    key={col}
                    className="font-mono-custom text-[10px] tracking-[0.12em] text-wm-text-dim uppercase px-5 py-2.5 text-left border-b border-white/[0.06]"
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRowSkeleton key={i} cols={6} />
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-8 text-center text-wm-text-dim font-mono-custom text-[12px]"
                >
                  No orders match this filter.
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors cursor-pointer last:border-0"
                >
                  <td className="px-5 py-3">
                    <Link
                      href={`/orders/${order.id}`}
                      className="font-mono-custom text-[12px] text-rust-bright hover:text-rust transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-[13px] text-wm-text">
                    {order.description}
                  </td>
                  <td className="px-5 py-3 font-mono-custom text-[11px] text-wm-text-dim">
                    {order.process}
                  </td>
                  <td className="px-5 py-3">
                    <StatusPill status={order.status} />
                  </td>
                  <td className="px-5 py-3">
                    <ProgressBar value={order.progress_pct} status={order.status} />
                  </td>
                  <td className="px-5 py-3 font-mono-custom text-[11px] text-wm-text">
                    {formatDate(order.est_ship_date)}
                    {order.status === "ready" && (
                      <span className="ml-1 text-wm-green">✓</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
