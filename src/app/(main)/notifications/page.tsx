"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, UserPlus, MessageCircle, AtSign, Zap, TrendingUp, Bell } from "lucide-react";
import { TopBar } from "@/components/nav/TopBar";
import { Avatar } from "@/components/ui/Avatar";
import { MOCK_NOTIFICATIONS, type Notification } from "@/lib/mock-data";
import { timeAgo, formatUSD } from "@/lib/utils";
import { cn } from "@/lib/utils";

const NOTIF_ICONS: Record<Notification["type"], React.ReactNode> = {
  like: <Heart size={14} className="text-accent-rose fill-accent-rose" />,
  follow: <UserPlus size={14} className="text-primary-light" />,
  comment: <MessageCircle size={14} className="text-accent-cyan" />,
  mention: <AtSign size={14} className="text-accent-green" />,
  tip: <Zap size={14} className="text-accent-amber fill-accent-amber" />,
  token: <TrendingUp size={14} className="text-primary-light" />,
};

const NOTIF_BG: Record<Notification["type"], string> = {
  like: "bg-accent-rose/15",
  follow: "bg-primary/15",
  comment: "bg-accent-cyan/15",
  mention: "bg-accent-green/15",
  tip: "bg-accent-amber/15",
  token: "bg-primary/15",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      <TopBar title="Notifications" />

      <div className="px-4 pt-4">
        {/* Header action */}
        {unreadCount > 0 && (
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-text-muted">{unreadCount} unread</span>
            <button onClick={markAllRead} className="text-xs text-primary-light hover:text-primary font-medium transition-colors">
              Mark all read
            </button>
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="text-center py-16 text-text-muted">
            <Bell size={36} className="mx-auto mb-3 opacity-20" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {notifications.map((notif, i) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-xl transition-all cursor-pointer",
                  notif.read
                    ? "hover:bg-white/[0.02]"
                    : "bg-primary/[0.04] hover:bg-primary/[0.06] border border-primary/[0.06]"
                )}
              >
                {/* Avatar + icon */}
                <div className="relative flex-shrink-0">
                  <Avatar src={notif.actor.avatar} alt={notif.actor.displayName} size="md" />
                  <div className={cn("absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-bg-base", NOTIF_BG[notif.type])}>
                    {NOTIF_ICONS[notif.type]}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary leading-relaxed">
                    <span className="font-semibold">{notif.actor.displayName}</span>{" "}
                    <span className="text-text-secondary">{notif.content}</span>
                  </p>
                  {notif.amount && (
                    <div className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-accent-amber bg-accent-amber/10 border border-accent-amber/20 px-2 py-0.5 rounded-full">
                      <Zap size={9} className="fill-accent-amber" /> {formatUSD(notif.amount)}
                    </div>
                  )}
                  <div className="text-xs text-text-muted mt-1">{timeAgo(notif.createdAt)}</div>
                </div>

                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-primary-light flex-shrink-0 mt-2" />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
