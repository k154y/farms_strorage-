import { useEffect, useState } from "react";
import StatusBadge from "../../components/common/StatusBadge";
import { getBookingsByManager, updateBookingStatus } from "../../services/bookingService";
import { getUser } from "../../utilis/auth";

const statusActionsByCurrentStatus = {
  PENDING: [
    { label: "Approve", status: "APPROVED", className: "bg-[#47A369] text-white" },
    { label: "Reject", status: "REJECTED", className: "bg-red-600 text-white" },
    { label: "Cancel", status: "CANCELLED", className: "bg-slate-600 text-white" },
  ],
  APPROVED: [
    { label: "Delivered", status: "DELIVERED", className: "bg-blue-600 text-white" },
    { label: "Cancel", status: "CANCELLED", className: "bg-slate-600 text-white" },
  ],
  DELIVERED: [
    { label: "In Storage", status: "IN_STORAGE", className: "bg-violet-600 text-white" },
  ],
  IN_STORAGE: [
    { label: "Complete", status: "COMPLETED", className: "bg-emerald-600 text-white" },
  ],
};

export default function BookingRequestsPage() {
  const user = getUser();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const loadItems = async () => {
    try {
      const data = await getBookingsByManager(user?.id);
      setItems(data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load booking requests");
    }
  };

  useEffect(() => {
    loadItems();
  }, [user?.id]);

  const handleStatusChange = async (bookingId, status) => {
    try {
      setError("");
      await updateBookingStatus(bookingId, {
        status,
        changedByUserId: user?.id,
        comment: `Updated by storage manager to ${status}`,
      });
      await loadItems();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to update booking status");
    }
  };

  return (
    <div className="space-y-4">
      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full">
          <thead className="bg-slate-50 text-left text-sm text-slate-600">
            <tr>
              <th className="p-4">Booking</th>
              <th className="p-4">Farmer</th>
              <th className="p-4">Facility</th>
              <th className="p-4">Cold Room</th>
              <th className="p-4">Quantity</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-slate-100">
                <td className="p-4">#{item.id}</td>
                <td className="p-4">{item.farmer?.fullName || "Unknown farmer"}</td>
                <td className="p-4">{item.facility?.name}</td>
                <td className="p-4">{item.coldRoom?.name}</td>
                <td className="p-4">{item.quantity}</td>
                <td className="p-4"><StatusBadge status={item.status} /></td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {(statusActionsByCurrentStatus[item.status] || []).map((action) => (
                      <button
                        key={action.status}
                        onClick={() => handleStatusChange(item.id, action.status)}
                        className={`rounded-lg px-3 py-2 text-xs font-semibold ${action.className}`}
                      >
                        {action.label}
                      </button>
                    ))}
                    {!(statusActionsByCurrentStatus[item.status] || []).length && (
                      <span className="text-xs text-slate-400">No further actions</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="7" className="p-6 text-center text-slate-500">
                  No booking requests found under your facilities.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
