"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import {
  LayoutDashboard,
  Bell,
  List,
  Clock,
  Plus,
  FileText,
  RefreshCw,
  UserCog,
  Receipt,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Alerts", href: "/alerts", icon: Bell, badge: 3 },
    ],
  },
  {
    label: "Orders",
    items: [
      { label: "Active Orders", href: "/orders", icon: List, badge: 4 },
      { label: "Order History", href: "/orders/history", icon: Clock },
      { label: "New Order", href: "/orders/new", icon: Plus },
    ],
  },
  {
    label: "Procurement",
    items: [
      { label: "Quotes", href: "/quotes", icon: FileText },
      { label: "Quick Reorder", href: "/reorder", icon: RefreshCw },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Account Settings", href: "/account", icon: UserCog },
      { label: "Invoices & Billing", href: "/billing", icon: Receipt },
    ],
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <nav
        className={cn(
          "fixed lg:static top-0 left-0 bottom-0 z-40 w-[220px] flex-shrink-0 pt-[58px] lg:pt-0",
          "lg:translate-x-0 transition-transform duration-250 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={{
          background: "rgba(26, 31, 46, 0.6)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="py-6 overflow-y-auto h-full">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="mb-6">
              <div className="font-mono-custom text-[9px] tracking-[0.2em] text-wm-text-dim uppercase px-5 mb-1.5">
                {section.label}
              </div>
              {section.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-2.5 px-5 py-2 text-[13px] transition-all duration-150 border-l-2 select-none",
                      active
                        ? "text-rust-bright border-rust-bright bg-rust/8 nav-active-border"
                        : "text-wm-text-dim border-transparent hover:text-wm-text hover:bg-white/[0.04]"
                    )}
                    id={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Icon
                      size={15}
                      className={cn(
                        "flex-shrink-0",
                        active ? "opacity-100" : "opacity-60"
                      )}
                    />
                    {item.label}
                    {item.badge !== undefined && (
                      <Badge count={item.badge} />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}
