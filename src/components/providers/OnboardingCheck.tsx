"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

export function OnboardingCheck() {
  const { authenticated, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!ready || !authenticated) return;
    if (pathname === "/onboarding") return;
    const done = localStorage.getItem("verse_onboarding_done");
    if (!done) {
      router.push("/onboarding");
    }
  }, [ready, authenticated, pathname, router]);

  return null;
}
