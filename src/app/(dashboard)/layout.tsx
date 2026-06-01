import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar";
import DesktopSidebar from "@/components/dashboard/desktop-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <DesktopSidebar />

      <div className="flex flex-1 flex-col">
        <DashboardNavbar />

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
