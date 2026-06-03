import { requireAuth } from "@/lib/pirateCOS/auth";
import AdminSidebar from "@/components/pirateCOS/AdminSidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Require authentication - will redirect to login if not authenticated
  await requireAuth();

  return (
    <div className="min-h-screen" style={{ background: "#F7F7F6" }}>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 ml-0 lg:ml-60 min-w-0 pt-14 lg:pt-0">
          <main className="w-full">{children}</main>
        </div>
      </div>
    </div>
  );
}
