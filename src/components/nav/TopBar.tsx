"use client";
import { Search, Zap } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/lib/hooks/useAuth";
import config from "@/lib/config";

type TopBarProps = {
  title?: string;
  showSearch?: boolean;
  showLogo?: boolean;
};

export function TopBar({ title, showSearch = false, showLogo = true }: TopBarProps) {
  const { user } = useAuth();
  const avatarSrc = user?.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=default`;
  const profileHref = user?.username ? `/${user.username}` : "/login";

  return (
    <header className="sticky top-0 z-30 glass-nav px-4 h-14 flex items-center justify-between md:hidden">
      {showLogo && !title ? (
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Zap size={14} className="text-white fill-white" />
          </div>
          <span className="text-lg font-bold font-display gradient-text">{config.name}</span>
        </Link>
      ) : (
        <h1 className="text-lg font-bold text-text-primary">{title}</h1>
      )}

      <div className="flex items-center gap-3">
        {showSearch && (
          <button className="w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors">
            <Search size={17} />
          </button>
        )}
        <Link href={profileHref}>
          <Avatar src={avatarSrc} alt={user?.displayName ?? "Profile"} size="sm" />
        </Link>
      </div>
    </header>
  );
}
