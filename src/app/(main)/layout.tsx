import { BottomNav } from "@/components/nav/BottomNav";
import { DesktopSidebar } from "@/components/nav/DesktopSidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg-base">
      <DesktopSidebar />
      <main className="flex-1 min-h-screen max-w-2xl mx-auto w-full">
        {children}
      </main>
      <div className="hidden xl:block w-80 shrink-0" />
      <BottomNav />
    </div>
  );
}
