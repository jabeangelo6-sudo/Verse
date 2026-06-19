"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, PlusSquare, Bell, TrendingUp, Settings, Zap, LogOut, Crown, FileText, Brain, Shield, BarChart3, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/lib/hooks/useAuth";
import { formatCount } from "@/lib/utils";
import config from "@/lib/config";

const MAIN_NAV = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/explore", icon: Compass, label: "Explore" },
  { href: "/create", icon: PlusSquare, label: "Create" },
  { href: "/notifications", icon: Bell, label: "Notifications", badge: 3 },
  { href: "/wallet", icon: TrendingUp, label: "Earnings" },
];

const EARN_NAV = [
  { href: "/inner-circle", icon: Crown, label: "Inner Circle" },
  { href: "/licensing", icon: FileText, label: "Licensing" },
  { href: "/brain-trust", icon: Brain, label: "Brain Trust" },
  { href: "/whistle", icon: Shield, label: "Verified Leaks" },
  { href: "/derivatives", icon: BarChart3, label: "Content Futures" },
];

export function DesktopSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r border-border px-4 py-6 gap-2 overflow-y-auto no-scrollbar">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 px-3 mb-6">
        <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-sm">
          <Zap size={16} className="text-white fill-white" />
        </div>
        <span className="text-xl font-bold font-display gradient-text">{config.name}</span>
      </Link>

      {/* Main nav */}
      <nav className="flex flex-col gap-1">
        {MAIN_NAV.map(({ href, icon: Icon, label, badge }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                active ? "bg-primary/10 text-primary-light" : "text-text-secondary hover:bg-white/[0.04] hover:text-text-primary"
              )}>
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

      {/* Earn section */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="px-3 mb-2">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Earn & Build</span>
        </div>
        <nav className="flex flex-col gap-1">
          {EARN_NAV.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link key={href} href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative",
                  active ? "bg-accent-amber/10 text-accent-amber" : "text-text-secondary hover:bg-white/[0.04] hover:text-text-primary"
                )}>
                <Icon size={17} strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-sm font-medium">{label}</span>
                {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-accent-amber rounded-full" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex-1" />

      {/* Creator stats mini */}
      <div className="card p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-muted font-medium">Your earnings</span>
          <span className="badge badge-green text-[10px]">Live</span>
        </div>
        <div className="text-lg font-bold text-text-primary">$0.00</div>
        <div className="flex gap-3 mt-2 text-xs text-text-muted">
          <span>{user ? formatCount(0) + " followers" : "Sign in"}</span>
        </div>
      </div>

      {/* Profile footer */}
      <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group">
        <Avatar
          src={user?.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=default`}
          alt={user?.displayName ?? "You"}
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-text-primary truncate">{user?.displayName ?? "Sign in"}</div>
          <div className="text-xs text-text-muted">{user?.username ? `@${user.username}` : "to get started"}</div>
        </div>
        <LogOut size={15} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <Link href="/integrations" className="flex items-center gap-3 px-3 py-2 rounded-xl text-text-muted hover:text-text-secondary hover:bg-white/[0.04] transition-all text-sm">
        <Link2 size={16} />
        Integrations
      </Link>
      <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-xl text-text-muted hover:text-text-secondary hover:bg-white/[0.04] transition-all text-sm">
        <Settings size={16} />
        Settings
      </Link>
    </aside>
  );
}
