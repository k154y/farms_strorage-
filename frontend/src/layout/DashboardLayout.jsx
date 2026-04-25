import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardSidebar from "../components/layout/Sidebar";
import DashboardTopbar from "../components/layout/DashboardTopbar";

const titleMap = {
  "/farmer/dashboard": ["Farmer Dashboard", "Manage bookings, listings, and orders"],
  "/farmer/bookings": ["My Bookings", "Review your storage booking history and status"],
  "/farmer/bookings/create": ["Create Booking", "Find available storage and submit a new request"],
  "/farmer/listings": ["My Listings", "Track and manage your marketplace produce listings"],
  "/farmer/listings/create": ["Create Listing", "Add a new produce listing for marketplace buyers"],
  "/farmer/orders": ["Orders Received", "View incoming marketplace orders from buyers"],
  "/farmer/notifications": ["Notifications", "Stay updated on booking, listing, and order activity"],
  "/farmer/profile": ["Profile", "Manage your farmer account details"],
  "/storage/dashboard": ["Storage Dashboard", "Manage facilities, rooms, and requests"],
  "/storage/facilities": ["Facilities", "View and manage your registered storage facilities"],
  "/storage/facilities/create": ["Add Facility", "Register a new storage facility for your account"],
  "/storage/facilities/:id": ["Facility Details", "View a specific storage facility"],
  "/storage/cold-rooms": ["Cold Rooms", "Manage your facility cold rooms and capacity"],
  "/storage/booking-requests": ["Booking Requests", "Review incoming farmer booking requests"],
  "/storage/notifications": ["Notifications", "View storage account updates and review activity"],
  "/storage/profile": ["Profile", "Upload verification documents and complete account review"],
  "/transport/dashboard": ["Transport Dashboard", "Manage vehicles and transport requests"],
  "/transport/vehicles": ["Vehicles", "View and manage your registered vehicles"],
  "/transport/vehicles/create": ["Add Vehicle", "Register a new vehicle for transport jobs"],
  "/transport/requests": ["Requests", "Review assigned and pending transport requests"],
  "/transport/requests/:id": ["Request Details", "View a specific transport request"],
  "/transport/notifications": ["Notifications", "View updates on transport assignments and delivery progress"],
  "/transport/profile": ["Profile", "Upload verification documents and complete account review"],
  "/admin/dashboard": ["Admin Dashboard", "Manage users, approvals, and audit logs"],
  "/admin/users": ["Users", "View registered accounts across the platform"],
  "/admin/pending-approvals": ["Pending Approvals", "Review and approve storage owner and transporter accounts"],
  "/admin/verification-documents": ["Verification Documents", "Review all uploaded user documents"],
  "/admin/notifications": ["Notifications", "View admin account notifications"],
  "/admin/audit-logs": ["Audit Logs", "Inspect recorded system activity"],
};

export default function DashboardLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [title, subtitle] = titleMap[location.pathname] || ["Dashboard", ""];

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <DashboardSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onNavigate={() => setMobileOpen(false)}
      />
      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <DashboardTopbar
            title={title}
            subtitle={subtitle}
            onMenuToggle={() => setMobileOpen((current) => !current)}
          />
          <Outlet />
        </div>
      </main>
    </div>
  );
}
