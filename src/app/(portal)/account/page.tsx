"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { MOCK_USER } from "@/lib/mock-data";
import { toast } from "sonner";

export default function AccountPage() {
  const user = MOCK_USER;
  const [form, setForm] = useState({
    full_name: user.full_name,
    email: user.email,
    phone: "(512) 555-0192",
    company: user.company?.name ?? "",
    account_number: user.company?.account_number ?? "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast.success("Account settings saved.");
  };

  return (
    <div className="animate-fadeInUp max-w-xl">
      <PageHeader title="Account Settings" subtitle="// Manage your portal account" />

      <form onSubmit={handleSave} className="space-y-6">
        <Section title="Contact Information">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Full Name">
              <input
                value={form.full_name}
                onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
                className="wm-input"
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="wm-input"
              />
            </Field>
            <Field label="Phone" className="col-span-2">
              <input
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                className="wm-input"
              />
            </Field>
          </div>
        </Section>

        <Section title="Company">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Company Name" className="col-span-2">
              <input value={form.company} readOnly className="wm-input opacity-50 cursor-not-allowed" />
            </Field>
            <Field label="Account Number">
              <input value={form.account_number} readOnly className="wm-input opacity-50 cursor-not-allowed" />
            </Field>
            <Field label="Role">
              <input value={user.role.charAt(0).toUpperCase() + user.role.slice(1)} readOnly className="wm-input opacity-50 cursor-not-allowed" />
            </Field>
          </div>
        </Section>

        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="primary" loading={saving} id="save-account-btn">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="font-head font-semibold text-[13px] tracking-[0.1em] uppercase text-rust">
          {title}
        </span>
        <div className="flex-1 h-px bg-rust/20" />
      </div>
      {children}
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <label className="font-mono-custom text-[10px] tracking-[0.12em] text-wm-text-dim uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}
