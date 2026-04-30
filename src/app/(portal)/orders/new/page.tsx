"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";

const STEEL_GRADES = ["A36", "A572-50", "A514", "A516-70", "AR400", "AR500", "A992", "A500"];
const PROCESSES = ["Laser Cutting", "Plasma Cutting", "Press Brake Forming", "Plate Rolling", "Saw Cutting", "Drilling", "Welding"];

export default function NewOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    grade: "",
    thickness: "",
    process: "",
    quantity: "",
    unit: "pcs",
    dimensions: "",
    notes: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    toast.success("Order submitted — we'll review your specs and respond within 1 business day.");
    router.push("/dashboard");
  };

  return (
    <div className="animate-fadeInUp max-w-2xl">
      <PageHeader
        title="New Order"
        subtitle="// Fill in specs or upload drawings for a quote"
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Material & Specs */}
        <div>
          <SectionTitle>Material &amp; Specs</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            <FormGroup label="Steel Grade" required>
              <select name="grade" value={form.grade} onChange={handleChange} className="wm-input" required>
                <option value="">Select grade…</option>
                {STEEL_GRADES.map((g) => <option key={g}>{g}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Thickness" required>
              <input name="thickness" value={form.thickness} onChange={handleChange} placeholder='e.g. 3/8"' className="wm-input" required />
            </FormGroup>
            <FormGroup label="Process" required>
              <select name="process" value={form.process} onChange={handleChange} className="wm-input" required>
                <option value="">Select process…</option>
                {PROCESSES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Quantity" required>
              <div className="flex gap-2">
                <input name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} placeholder="0" className="wm-input" required />
                <select name="unit" value={form.unit} onChange={handleChange} className="wm-input w-20">
                  <option>pcs</option>
                  <option>lbs</option>
                  <option>ft</option>
                </select>
              </div>
            </FormGroup>
            <FormGroup label="Dimensions / Size" className="col-span-2">
              <input name="dimensions" value={form.dimensions} onChange={handleChange} placeholder='e.g. 12" × 18" flat, 36" OD cylinder' className="wm-input" />
            </FormGroup>
            <FormGroup label="Description / Part Name" className="col-span-2" required>
              <input name="description" value={form.description} onChange={handleChange} placeholder="Brief description of the part" className="wm-input" required />
            </FormGroup>
          </div>
        </div>

        {/* Drawings */}
        <div>
          <SectionTitle>Drawings &amp; Files</SectionTitle>
          <div
            className="upload-zone-dash rounded p-8 text-center cursor-pointer bg-rust/[0.03] transition-all hover:bg-rust/[0.07]"
          >
            <div className="flex justify-center mb-3">
              <UploadCloud size={32} className="text-wm-text-dim opacity-50" />
            </div>
            <p className="text-[13px] text-wm-text-dim">
              <span className="text-rust font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="font-mono-custom text-[10px] text-wm-text-dim mt-1 tracking-[0.08em]">
              DXF · DWG · PDF · STEP · IGES
            </p>
          </div>
        </div>

        {/* Notes */}
        <div>
          <SectionTitle>Notes</SectionTitle>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Special instructions, tolerances, certifications needed…"
            className="wm-input"
            rows={4}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="primary" loading={loading} id="submit-order-btn">
            Submit Order
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="font-head font-semibold text-[13px] tracking-[0.1em] uppercase text-rust">
        {children}
      </span>
      <div className="flex-1 h-px bg-rust/20" />
    </div>
  );
}

function FormGroup({
  label,
  children,
  required,
  className,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <label className="font-mono-custom text-[10px] tracking-[0.12em] text-wm-text-dim uppercase">
        {label}
        {required && <span className="text-rust ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
