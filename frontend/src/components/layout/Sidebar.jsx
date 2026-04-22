import { Link } from "react-router-dom";
import { getUser, logout } from "../../utilis/auth";

const menus = {
  FARMER: [
    { label: "Dashboard", path: "/farmer/dashboard" },
    { label: "My Bookings", path: "/farmer/bookings" },
    { label: "Create Booking", path: "/farmer/bookings/create" },
    { label: "My Listings", path: "/farmer/listings" },
    { label: "Create Listing", path: "/farmer/listings/create" },
    { label: "Orders Received", path: "/farmer/orders" },
    { label: "Notifications", path: "/farmer/notifications" },
    { label: "Profile", path: "/farmer/profile" },
  ],
  STORAGE_MANAGER: [
    { label: "Dashboard", path: "/storage/dashboard" },
    { label: "Facilities", path: "/storage/facilities" },
    { label: "Add Facility", path: "/storage/facilities/create" },
    { label: "Cold Rooms", path: "/storage/cold-rooms" },
    { label: "Booking Requests", path: "/storage/booking-requests" },
    { label: "Facility Photos", path: "/storage/facility-photos" },
    { label: "Notifications", path: "/storage/notifications" },
    { label: "Profile", path: "/storage/profile" },
  ],
  TRANSPORTER: [
    { label: "Dashboard", path: "/transport/dashboard" },
    { label: "Vehicles", path: "/transport/vehicles" },
    { label: "Add Vehicle", path: "/transport/vehicles/create" },
    { label: "Requests", path: "/transport/requests" },
    { label: "Notifications", path: "/transport/notifications" },
    { label: "Profile", path: "/transport/profile" },
  ],
  ADMIN: [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Users", path: "/admin/users" },
    { label: "Pending Approvals", path: "/admin/pending-approvals" },
    { label: "Verification Documents", path: "/admin/verification-documents" },
    { label: "Notifications", path: "/admin/notifications" },
    { label: "Audit Logs", path: "/admin/audit-logs" },
  ],
};

export default function DashboardSidebar() {
  const user = getUser();

  return (
    <aside className="hidden md:flex w-72 flex-col border-r border-slate-200 bg-white p-6">
      <div className="mb-8 text-2xl font-bold text-[#304F3A]">ColdChain</div>
      <div className="mb-6 rounded-xl bg-slate-50 p-4">
        <p className="text-sm text-slate-500">Logged in as</p>
        <p className="font-semibold text-slate-900">{user?.fullName || "User"}</p>
        <p className="text-sm text-[#47A369]">{user?.role}</p>
      </div>

      <nav className="flex flex-col gap-2">
        {(menus[user?.role] || []).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-[#47A369]/10 hover:text-[#304F3A]"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={() => {
          logout();
          window.location.href = "/login";
        }}
        className="mt-auto rounded-lg bg-[#304F3A] px-4 py-2 text-sm font-semibold text-white"
      >
        Logout
      </button>
    </aside>
  );
}
