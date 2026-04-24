import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../../components/common/StatusBadge";
import { getMyBookings } from "../../services/bookingService";

export default function FarmerDashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getMyBookings().then(setBookings).catch(console.error);
  }, []);

  const recentBookings = bookings.slice(0, 5);
  const pendingBookings = bookings.filter((booking) => booking.status === "PENDING").length;
  const approvedBookings = bookings.filter((booking) => booking.status === "APPROVED").length;

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">My Bookings</p>
          <p className="mt-3 text-3xl font-black text-[#304F3A]">{bookings.length}</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Pending Bookings</p>
          <p className="mt-3 text-3xl font-black text-[#304F3A]">{pendingBookings}</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Approved Bookings</p>
          <p className="mt-3 text-3xl font-black text-[#304F3A]">{approvedBookings}</p>
        </div>
      </div>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Recent Bookings</h2>
            <p className="mt-1 text-sm text-slate-500">
              Your latest storage requests appear here.
            </p>
          </div>
          <Link to="/farmer/bookings" className="text-sm font-semibold text-[#47A369]">
            View all
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 px-6 py-10 text-center text-slate-500">
            No bookings found for this farmer account yet.
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full">
              <thead className="text-left text-sm text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="pb-3 pr-4 font-medium">ID</th>
                  <th className="pb-3 pr-4 font-medium">Facility</th>
                  <th className="pb-3 pr-4 font-medium">Quantity</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-slate-100 last:border-b-0">
                    <td className="py-4 pr-4 text-slate-900">{booking.id}</td>
                    <td className="py-4 pr-4 text-slate-600">{booking.facility?.name || "Unknown facility"}</td>
                    <td className="py-4 pr-4 text-slate-600">{booking.quantity}</td>
                    <td className="py-4 pr-4">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="py-4">
                      <Link to={`/farmer/bookings/${booking.id}`} className="font-semibold text-[#47A369]">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
