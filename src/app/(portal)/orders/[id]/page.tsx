// Server Component — can export generateStaticParams for static export
import { notFound } from "next/navigation";
import { MOCK_ORDERS, MOCK_HISTORY_ORDERS } from "@/lib/mock-data";
import { OrderDetailView } from "./OrderDetailView";

const ALL_ORDERS = [...MOCK_ORDERS, ...MOCK_HISTORY_ORDERS];

// Tells Next.js which order IDs to pre-render at build time
// Required for `output: "export"` with dynamic routes
export function generateStaticParams() {
  return ALL_ORDERS.map((order) => ({ id: order.id }));
}

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const order = ALL_ORDERS.find((o) => o.id === params.id);
  if (!order) notFound();
  return <OrderDetailView order={order} />;
}
