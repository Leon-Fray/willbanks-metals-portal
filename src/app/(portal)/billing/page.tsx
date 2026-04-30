"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { cn, formatCurrency, formatDateFull } from "@/lib/utils";
import { MOCK_INVOICES } from "@/lib/mock-data";
import { Download } from "lucide-react";
import { toast } from "sonner";

function InvoiceStatus({ paid }: { paid: boolean }) {
  return (
    <span
      className={cn(
        "font-mono-custom text-[9px] tracking-widest uppercase px-1.5 py-0.5 rounded-sm border",
        paid
          ? "bg-wm-green/10 text-wm-green border-wm-green/20"
          : "bg-amber-500/10 text-amber-300 border-amber-500/20"
      )}
    >
      {paid ? "Paid" : "Outstanding"}
    </span>
  );
}

export default function BillingPage() {
  const totalOutstanding = MOCK_INVOICES.filter((i) => !i.paid_at).reduce(
    (sum, i) => sum + i.amount,
    0
  );

  return (
    <div className="animate-fadeInUp">
      <PageHeader
        title="Invoices & Billing"
        subtitle={`// ${MOCK_INVOICES.filter((i) => !i.paid_at).length} outstanding invoice(s)`}
      />

      {/* Outstanding summary */}
      {totalOutstanding > 0 && (
        <div
          className="mb-6 p-5 rounded-sm border"
          style={{
            background: "rgba(212,146,42,0.06)",
            borderColor: "rgba(212,146,42,0.25)",
          }}
        >
          <div className="font-mono-custom text-[10px] tracking-[0.15em] text-amber-metal/70 uppercase mb-1">
            Total Outstanding
          </div>
          <div className="font-head font-bold text-[28px] text-amber-metal">
            {formatCurrency(totalOutstanding)}
          </div>
          <p className="text-[12px] text-wm-text-dim mt-1">
            Payment due — contact your account rep for wire/ACH details.
          </p>
        </div>
      )}

      {/* Invoice table */}
      <div className="bg-steel-mid border border-white/[0.07] rounded-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/[0.07]">
          <span className="font-head font-semibold text-[14px] tracking-[0.06em] uppercase text-wm-text">
            Invoice History
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.15)" }}>
                {["Invoice #", "Amount", "Due Date", "Paid Date", "Status", ""].map((col) => (
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
              {MOCK_INVOICES.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors last:border-0"
                >
                  <td className="px-5 py-3 font-mono-custom text-[12px] text-rust-bright">
                    {invoice.invoice_number}
                  </td>
                  <td className="px-5 py-3 font-head text-[16px] text-white">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="px-5 py-3 font-mono-custom text-[11px] text-wm-text">
                    {formatDateFull(invoice.due_date)}
                  </td>
                  <td className="px-5 py-3 font-mono-custom text-[11px] text-wm-text-dim">
                    {invoice.paid_at ? formatDateFull(invoice.paid_at) : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <InvoiceStatus paid={!!invoice.paid_at} />
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toast.info("Downloading PDF…")}
                      className="flex items-center gap-1.5 font-mono-custom text-[10px] text-wm-text-dim hover:text-rust transition-colors"
                    >
                      <Download size={12} />
                      PDF
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
