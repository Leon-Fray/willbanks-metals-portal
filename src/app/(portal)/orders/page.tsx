"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";

import { cn, formatDate } from "@/lib/utils";
import { MOCK_ORDERS } from "@/lib/mock-data";

import { Search } from "lucide-react";

type FilterTab = "all" | "cutting" | "forming" | "ready" | "queue";

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "cutting", label: "Cutting" },
  { key: "forming", label: "Forming" },
  { key: "ready", label: "Ready" },
  { key: "queue", label: "In Queue" },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");

  const filtered = MOCK_ORDERS.filter((o) => {
    const matchesTab = activeTab === "all" || o.status === activeTab;
    const query = search.toLowerCase();
    const matchesSearch =
      !query ||
      o.order_number.toLowerCase().includes(query) ||
      o.description.toLowerCase().includes(query) ||
      o.process.toLowerCase().includes(query);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="animate-fadeInUp">
      <PageHeader
        title="Active Orders"
        subtitle={`// ${MOCK_ORDERS.length} orders in progress`}
        action={
          <Link href="/orders/new">
            <Button variant="primary" id="new-order-btn-orders">
              + New Order
            </Button>
          </Link>
        }
      />

      <div className="bg-steel-mid border border-white/[0.07] rounded-sm overflow-hidden">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-white/[0.07]">
          <div className="flex gap-2 flex-wrap">
            {FILTER_TABS.map(({ key, label }) => (
              <button
                key={key}
                id={`orders-filter-${key}`}
                onClick={() => setActiveTab(key)}
                className={cn(
                  "font-mono-custom text-[10px] tracking-[0.08em] px-2.5 py-1 rounded-sm border transition-all duration-150",
                  activeTab === key
                    ? "bg-rust border-rust text-white"
                    : "bg-transparent border-white/15 text-wm-text-dim hover:border-rust/50 hover:text-wm-text"
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-wm-text-dim"
            />
            <input
              type="text"
              placeholder="Search orders…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="wm-input pl-8 w-48 text-[12px] py-1.5"
              id="orders-search"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.15)" }}>
                {["Order ID", "Description", "Grade", "Qty", "Process", "Status", "Est. Ship"].map(
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
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-wm-text-dim font-mono-custom text-[12px]"
                  >
                    No orders match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
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
                    <td className="px-5 py-3 font-mono-custom text-[11px] text-wm-text">
                      {order.line_items?.[0]?.grade} {order.line_items?.[0]?.thickness}
                    </td>
                    <td className="px-5 py-3 font-mono-custom text-[11px] text-wm-text">
                      {order.line_items?.[0]?.quantity} {order.line_items?.[0]?.unit}
                    </td>
                    <td className="px-5 py-3 font-mono-custom text-[11px] text-wm-text-dim">
                      {order.process}
                    </td>
                    <td className="px-5 py-3">
                      <StatusPill status={order.status} />
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
    </div>
  );
}
