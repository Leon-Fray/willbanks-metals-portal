"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

const QUICK_ITEMS = [
  { name: "Bracket Plates 12×18", spec: "A36 · 3/8\" · 48 pcs", lastOrder: "WMI-28841" },
  { name: "Formed Channels", spec: "A572-50 · 1/4\" · 24 pcs", lastOrder: "WMI-28838" },
  { name: "Gusset Plates 8×10", spec: "A36 · 1/4\" · 120 pcs", lastOrder: "WMI-28811" },
  { name: "Plasma Cut Flanges", spec: "A514 · 3/4\" · 18 pcs", lastOrder: "WMI-28760" },
];

export default function ReorderPage() {
  return (
    <div className="animate-fadeInUp">
      <PageHeader title="Quick Reorder" subtitle="// Repeat a previous order in one click" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {QUICK_ITEMS.map((item) => (
          <div
            key={item.name}
            className="bg-black/20 border border-white/[0.07] rounded p-4 hover:border-rust/40 hover:bg-rust/[0.06] transition-all cursor-pointer"
          >
            <div className="font-head font-semibold text-[14px] tracking-[0.04em] text-white mb-1">
              {item.name}
            </div>
            <div className="font-mono-custom text-[10px] text-wm-text-dim leading-relaxed mb-3">
              {item.spec}
              <br />
              Last: {item.lastOrder}
            </div>
            <button
              onClick={() => toast.success(`Reorder started for ${item.name}`)}
              className="flex items-center gap-1.5 font-head text-[11px] tracking-[0.08em] text-rust hover:text-rust-bright transition-colors uppercase"
            >
              <RefreshCw size={12} />
              Reorder
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
