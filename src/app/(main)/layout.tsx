import { BottomNav } from "@/components/nav/BottomNav";
import { DesktopSidebar } from "@/components/nav/DesktopSidebar";
import { ToastProvider } from "@/components/ui/Toast";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-bg-base">
        <DesktopSidebar />
        <main className="flex-1 min-h-screen max-w-2xl mx-auto w-full">
          {children}
        </main>
        {/* Desktop right panel placeholder */}
        <div className="hidden xl:block w-80 shrink-0" />
        <BottomNav />
      </div>
    </ToastProvider>
  );
}
