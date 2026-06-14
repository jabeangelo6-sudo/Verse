"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, PlusSquare, Bell, Wallet, Settings, Zap, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { ME } from "@/lib/mock-data";
import { formatCount } from "@/lib/utils";
import config from "@/lib/config";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/explore", icon: Compass, label: "Explore" },
  { href: "/create", icon: PlusSquare, label: "Create" },
  { href: "/notifications", icon: Bell, label: "Notifications", badge: 3 },
  { href: "/wallet", icon: Wallet, label: "Wallet" },
];

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r border-border px-4 py-6 gap-2">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 px-3 mb-6">
        <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-sm">
          <Zap size={16} className="text-white fill-white" />
        </div>
        <span className="text-xl font-bold font-display gradient-text">{config.name}</span>
      </Link>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label, badge }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                active
                  ? "bg-primary/10 text-primary-light"
                  : "text-text-secondary hover:bg-white/[0.04] hover:text-text-primary"
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span className="font-medium">{label}</span>
              {badge && (
                <span className="ml-auto bg-accent-rose text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {badge}
                </span>
              )}
              {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary-light rounded-full" />}
            </Link>
          );
        })}
      </nav>

      {/* Creator stats mini */}
      <div className="card p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-muted font-medium">Your earnings</span>
          <span className="badge badge-green text-[10px]">Live</span>
        </div>
        <div className="text-lg font-bold text-text-primary">$1,820.50</div>
        <div className="flex gap-3 mt-2 text-xs text-text-muted">
          <span>{formatCount(ME.followers)} followers</span>
          <span>·</span>
          <span>{ME.tokenSymbol} ${ME.tokenPrice}</span>
        </div>
      </div>

      {/* Profile footer */}
      <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group">
        <Avatar src={ME.avatar} alt={ME.displayName} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-text-primary truncate">{ME.displayName}</div>
          <div className="text-xs text-text-muted">@{ME.username}</div>
        </div>
        <LogOut size={15} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-xl text-text-muted hover:text-text-secondary hover:bg-white/[0.04] transition-all text-sm">
        <Settings size={16} />
        Settings
      </Link>
    </aside>
  );
}
