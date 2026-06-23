"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WalletRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/earnings"); }, [router]);
  return null;
}
