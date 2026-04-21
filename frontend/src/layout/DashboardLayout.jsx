import { Outlet, useLocation } from "react-router-dom";
import DashboardSidebar from "../components/layout/Sidebar";
import DashboardTopbar from "../components/layout/DashboardTopbar";

const titleMap = {
  "/farmer/dashboard": ["Farmer Dashboard", "Manage bookings, listings, and orders"],
  "/storage/dashboard": ["Storage Dashboard", "Manage facilities, rooms, and requests"],
  "/transport/dashboard": ["Transport Dashboard", "Manage vehicles and transport requests"],
  "/admin/dashboard": ["Admin Dashboard", "Manage users, approvals, and audit logs"],
};

export default function DashboardLayout() {
  const location = useLocation();
  const [title, subtitle] = titleMap[location.pathname] || ["Dashboard", ""];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <DashboardSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <DashboardTopbar title={title} subtitle={subtitle} />
        <Outlet />
      </main>
    </div>
  );
}