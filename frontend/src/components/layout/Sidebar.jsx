import { Link } from "react-router-dom";
import { getUser, logout } from "../../utilis/auth";

const menus = {
  FARMER: [
    { label: "Dashboard", path: "/farmer/dashboard" },
    { label: "My Bookings", path: "/farmer/bookings" },
    {label:"Find storage",path:"/farmer/findstorage"},
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

export default function DashboardSidebar({ mobileOpen = false, onNavigate = () => {}, onClose = () => {} }) {
  const user = getUser();
  const links = menus[user?.role] || [];

  return (
    <>
      <aside className="hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
        <div className="flex h-full min-h-0 flex-col p-6">
          <div className="mb-8 text-2xl font-bold text-[#304F3A]">ColdChain</div>
         

          <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
            {links.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-[#47A369]/10 hover:text-[#304F3A]"
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
            className="mt-6 rounded-lg bg-[#304F3A] px-4 py-2 text-sm font-semibold text-white"
          >
            Logout
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/40 md:hidden" onClick={onClose}>
          <aside
            className="h-full w-72 max-w-[85vw] bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-full min-h-0 flex-col p-6">
              <div className="mb-8 text-2xl font-bold text-[#304F3A]">ColdChain</div>
              <div className="mb-6 rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Logged in as</p>
                <p className="font-semibold text-slate-900">{user?.fullName || "User"}</p>
                <p className="text-sm text-[#47A369]">{user?.role}</p>
              </div>

              <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                {links.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onNavigate}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-[#47A369]/10 hover:text-[#304F3A]"
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
                className="mt-6 rounded-lg bg-[#304F3A] px-4 py-2 text-sm font-semibold text-white"
              >
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
