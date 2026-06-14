"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, PlusSquare, Bell, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/explore", icon: Compass, label: "Explore" },
  { href: "/create", icon: PlusSquare, label: "Create" },
  { href: "/notifications", icon: Bell, label: "Alerts" },
  { href: "/wallet", icon: Wallet, label: "Wallet" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-nav safe-pb md:hidden">
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className="relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors">
              <span className={cn("transition-colors duration-200", active ? "text-primary-light" : "text-text-muted")}>
                <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              </span>
              <span className={cn("text-[10px] font-medium transition-colors duration-200", active ? "text-primary-light" : "text-text-muted")}>
                {label}
              </span>
              {active && (
                <motion.div
                  layoutId="nav-dot"
                  className="absolute top-1 right-3 w-1 h-1 rounded-full bg-primary-light"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
