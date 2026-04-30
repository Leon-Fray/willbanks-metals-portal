"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("l.fray@mockupfab.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Demo mode — skip real auth
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    toast.success("Welcome back, L. Fray");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-[1]">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 bg-rust flex items-center justify-center"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)" }}
            >
              <span className="text-white font-head font-bold text-sm">M</span>
            </div>
            <div>
              <div className="font-head font-bold text-xl tracking-[0.08em] uppercase text-white">
                Mockup Fabricators
              </div>
              <div className="text-[9px] tracking-[0.18em] text-rust font-medium uppercase font-mono-custom">
                Customer Portal
              </div>
            </div>
          </div>
          <p className="font-mono-custom text-[11px] text-wm-text-dim text-center mt-2">
            Sign in to your portal account
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-sm p-6 border"
          style={{
            background: "rgba(44, 51, 71, 0.8)",
            borderColor: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(12px)",
          }}
        >
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono-custom text-[10px] tracking-[0.12em] text-wm-text-dim uppercase">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="wm-input"
                id="login-email"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-mono-custom text-[10px] tracking-[0.12em] text-wm-text-dim uppercase">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="wm-input"
                id="login-password"
                required
              />
            </div>

            {error && (
              <p className="font-mono-custom text-[11px] text-red-400">{error}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full mt-2"
              id="login-submit-btn"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-4 pt-4 border-t border-white/[0.07]">
            <p className="font-mono-custom text-[10px] text-wm-text-dim text-center">
              Demo: enter any password to continue
            </p>
          </div>
        </div>

        <p className="text-center font-mono-custom text-[10px] text-wm-text-dim mt-6">
          Need access?{" "}
          <span className="text-rust cursor-pointer hover:text-rust-bright transition-colors">
            Contact your Mockup Fabricators rep
          </span>
        </p>
      </div>
    </div>
  );
}
