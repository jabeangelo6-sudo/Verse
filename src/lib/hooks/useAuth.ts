"use client";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";

export type AppUser = {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  email?: string;
  verified: boolean;
  followerCount: number;
  followingCount: number;
  earnings: number;
};

export function useAuth() {
  const { ready, authenticated, user, logout, login } = usePrivy();
  const { wallets } = useWallets();
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(false);

  const walletAddress = wallets[0]?.address ?? "";

  useEffect(() => {
    if (!authenticated || !user) { setAppUser(null); return; }

    const syncUser = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: user.id,
            email: user.email?.address,
            displayName: user.google?.name ?? user.twitter?.name ?? user.email?.address?.split("@")[0] ?? "Creator",
            avatar: user.google?.picture ?? user.twitter?.profilePictureUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
            walletAddress,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setAppUser(data.user);
        }
      } finally {
        setLoading(false);
      }
    };

    syncUser();
  }, [authenticated, user, walletAddress]);

  return {
    ready,
    authenticated,
    user: appUser,
    loading,
    login,
    logout,
    privyUser: user,
  };
}
