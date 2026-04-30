"use client";

import { KpiCard } from "@/components/dashboard/KpiCard";
import { ActiveOrdersTable } from "@/components/dashboard/ActiveOrdersTable";
import { AlertsFeed } from "@/components/dashboard/AlertsFeed";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import {
  MOCK_ORDERS,
  MOCK_ALERTS,
  MOCK_DASHBOARD_STATS,
} from "@/lib/mock-data";
import Link from "next/link";

export default function DashboardPage() {
  const stats = MOCK_DASHBOARD_STATS;

  return (
    <div className="animate-fadeInUp">
      <PageHeader
        title="Dashboard"
        subtitle={`// LONE STAR FABRICATORS LLC — Account #LSF-0291`}
        action={
          <Link href="/orders/new">
            <Button variant="primary" id="new-order-btn">
              + New Order
            </Button>
          </Link>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
        <KpiCard
          label="Active Orders"
          value={stats.activeOrders}
          meta={`${stats.onFloor} on the floor`}
          accent="orange"
          id="kpi-active-orders"
        />
        <KpiCard
          label="Ready to Ship"
          value={stats.readyToShip}
          meta={`${stats.readyOrderNumber} awaiting pickup`}
          accent="green"
          id="kpi-ready-to-ship"
        />
        <KpiCard
          label="YTD Orders"
          value={stats.ytdOrders}
          meta={`+${stats.ytdChange}% vs last year`}
          accent="blue"
          id="kpi-ytd-orders"
        />
        <KpiCard
          label="Open Quote"
          value={stats.openQuotes}
          meta={`Expires in ${stats.quoteExpiresInDays} days`}
          accent="amber"
          id="kpi-open-quote"
        />
      </div>

      {/* Active Orders Table */}
      <div className="mb-6">
        <ActiveOrdersTable orders={MOCK_ORDERS} showFilters />
      </div>

      {/* Recent Alerts */}
      <AlertsFeed alerts={MOCK_ALERTS} />
    </div>
  );
}
