import { useEffect, useState } from "react";
import StatusBadge from "../../components/common/StatusBadge";
import { getBookingsByManager } from "../../services/bookingService";
import { getColdRooms, getFacilities } from "../../services/facilityService";
import { getUser } from "../../utilis/auth";

export default function StorageDashboard() {
  const user = getUser();
  const [stats, setStats] = useState({
    facilities: 0,
    coldRooms: 0,
    bookingRequests: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getFacilities(), getColdRooms(), getBookingsByManager(user?.id)])
      .then(([facilityRes, coldRoomRes, bookingsRes]) => {
        const facilities = (facilityRes || []).filter((facility) => facility.manager?.id === user?.id);
        const facilityIds = facilities.map((facility) => facility.id);
        const coldRooms = (coldRoomRes || []).filter((room) => facilityIds.includes(room.facility?.id));
        const bookings = bookingsRes || [];

        setStats({
          facilities: facilities.length,
          coldRooms: coldRooms.length,
          bookingRequests: bookings.length,
        });
        setRecentBookings(bookings.slice(0, 5));
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err?.message || "Failed to load dashboard data");
      });
  }, [user?.id]);

  return (
    <div className="space-y-8">
      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid gap-6 md:grid-cols-3">
        {[
          ["Facilities", stats.facilities],
          ["Cold Rooms", stats.coldRooms],
          ["Booking Requests", stats.bookingRequests],
        ].map(([title, value]) => (
          <div key={title} className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">{title}</p>
            <p className="mt-3 text-3xl font-black text-[#304F3A]">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Recent Booking Requests</h2>
        <p className="mt-2 text-slate-500">
          Latest bookings under your facilities.
        </p>

        {recentBookings.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 px-6 py-10 text-center text-slate-500">
            No booking requests found for your facilities yet.
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full">
              <thead className="text-left text-sm text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="pb-3 pr-4 font-medium">Booking</th>
                  <th className="pb-3 pr-4 font-medium">Farmer</th>
                  <th className="pb-3 pr-4 font-medium">Facility</th>
                  <th className="pb-3 pr-4 font-medium">Quantity</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-slate-100 last:border-b-0">
                    <td className="py-4 pr-4 text-slate-900">#{booking.id}</td>
                    <td className="py-4 pr-4 text-slate-600">{booking.farmer?.fullName || "Unknown farmer"}</td>
                    <td className="py-4 pr-4 text-slate-600">{booking.facility?.name || "Unknown facility"}</td>
                    <td className="py-4 pr-4 text-slate-600">{booking.quantity}</td>
                    <td className="py-4">
                      <StatusBadge status={booking.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
