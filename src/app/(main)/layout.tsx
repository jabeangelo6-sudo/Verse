import { BottomNav } from "@/components/nav/BottomNav";
import { DesktopSidebar } from "@/components/nav/DesktopSidebar";
import dynamic from "next/dynamic";

const OnboardingCheck = dynamic(
  () => import("@/components/providers/OnboardingCheck").then(m => m.OnboardingCheck),
  { ssr: false }
);

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg-base">
      <OnboardingCheck />
      <DesktopSidebar />
      <main className="flex-1 min-h-screen max-w-2xl mx-auto w-full">
        {children}
      </main>
      <div className="hidden xl:block w-80 shrink-0" />
      <BottomNav />
    </div>
  );
}
