"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import type { PortalUser } from "@/lib/types";

interface TopbarProps {
  user: PortalUser;
  onMenuToggle: () => void;
  menuOpen: boolean;
}

export function Topbar({ user, onMenuToggle, menuOpen }: TopbarProps) {
  const initials = user.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-6 h-[58px]"
      style={{
        background: "rgba(26, 31, 46, 0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(47, 127, 188, 0.3)",
      }}
    >
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-3">
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/willbanks-metals-logo.png`}
          alt="Willbanks Metals"
          width={36}
          height={36}
          className="flex-shrink-0 object-contain"
          priority
        />
        <div>
          <div className="font-head font-bold text-[17px] tracking-[0.08em] uppercase text-white leading-none">
            Willbanks Metals
          </div>
          <div className="text-[9px] tracking-[0.18em] text-rust font-medium uppercase mt-0.5 font-mono-custom">
            Customer Portal
          </div>
        </div>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-5">
        {/* Resume Tab */}
        <a
          href="https://docs.google.com/document/d/1gY-ctnOn55z2sF2GYHnrwPGXAsvoUdhKnDnj2CDQEzM/edit?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono-custom text-[11px] font-semibold tracking-wider uppercase transition-all duration-200 hover:scale-105 hover:brightness-110"
          style={{
            background: "rgba(147, 197, 253, 0.12)",
            color: "#93c5fd",
            boxShadow: "none",
            border: "1px solid rgba(147, 197, 253, 0.2)",
          }}
        >
          Resume
        </a>

        {/* Company */}
        <span className="hidden sm:block font-mono-custom text-[11px] text-wm-text-dim">
          {user.company?.name}
        </span>

        {/* User chip */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full bg-steel-light border border-rust flex items-center justify-center font-head font-bold text-[12px] text-rust flex-shrink-0"
          >
            {initials}
          </div>
          <span className="hidden md:block text-[13px] text-wm-text-dim">
            {user.full_name}
          </span>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden text-wm-text-dim hover:text-wm-text transition-colors"
          aria-label="Toggle navigation"
          id="mobile-menu-toggle"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
}
