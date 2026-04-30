"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { formatDate, formatDateFull } from "@/lib/utils";
import { MOCK_HISTORY_ORDERS } from "@/lib/mock-data";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";

export default function OrderHistoryPage() {
  const [search, setSearch] = useState("");

  const filtered = MOCK_HISTORY_ORDERS.filter((o) => {
    const q = search.toLowerCase();
    return (
      !q ||
      o.order_number.toLowerCase().includes(q) ||
      o.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="animate-fadeInUp">
      <PageHeader
        title="Order History"
        subtitle={`// ${MOCK_HISTORY_ORDERS.length} completed orders year-to-date`}
      />

      <div className="bg-steel-mid border border-white/[0.07] rounded-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.07]">
          <span className="font-head font-semibold text-[14px] tracking-[0.06em] uppercase text-wm-text">
            Completed Orders
          </span>
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-wm-text-dim" />
            <input
              type="text"
              placeholder="Search orders…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="wm-input pl-8 w-48 text-[12px] py-1.5"
              id="history-search"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.15)" }}>
                {["Order ID", "Description", "Grade", "Qty", "Completed", "Status", ""].map((col) => (
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
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors last:border-0"
                >
                  <td className="px-5 py-3">
                    <Link
                      href={`/orders/${order.id}`}
                      className="font-mono-custom text-[12px] text-rust-bright hover:text-rust transition-colors"
                    >
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-[13px] text-wm-text">{order.description}</td>
                  <td className="px-5 py-3 font-mono-custom text-[11px]">
                    {order.line_items?.[0]?.grade} {order.line_items?.[0]?.thickness}
                  </td>
                  <td className="px-5 py-3 font-mono-custom text-[11px]">
                    {order.line_items?.[0]?.quantity} {order.line_items?.[0]?.unit}
                  </td>
                  <td className="px-5 py-3 font-mono-custom text-[11px]">
                    {formatDate(order.est_ship_date)}
                  </td>
                  <td className="px-5 py-3">
                    <StatusPill status={order.status} />
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toast.success(`Reorder started for ${order.order_number}`)}
                      className="font-head text-[11px] tracking-[0.08em] text-rust hover:text-rust-bright transition-colors uppercase"
                    >
                      Reorder ↗
                    </button>
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
