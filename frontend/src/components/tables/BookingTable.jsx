import { Link } from "react-router-dom";
import StatusBadge from "../common/StatusBadge";

export default function BookingTable({
  items = [],
  onCancel = () => {},
  cancellingId = null,
}) {
  const canCancel = (item) => item.status === "PENDING" || item.status === "APPROVED";

  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
      <table className="min-w-full">
        <thead className="bg-slate-50 text-left text-sm text-slate-600">
          <tr>
            <th className="p-4">ID</th>
            <th className="p-4">Facility</th>
            <th className="p-4">Quantity</th>
            <th className="p-4">Status</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t border-slate-100">
              <td className="p-4">{item.id}</td>
              <td className="p-4">{item.facility?.name}</td>
              <td className="p-4">{item.quantity}</td>
              <td className="p-4"><StatusBadge status={item.status} /></td>
              <td className="p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Link to={`/farmer/bookings/${item.id}`} className="font-semibold text-[#47A369]">
                    View
                  </Link>
                  {canCancel(item) ? (
                    <button
                      type="button"
                      onClick={() => onCancel(item)}
                      disabled={cancellingId === item.id}
                      className="cursor-pointer font-semibold text-red-700 transition hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {cancellingId === item.id ? "Cancelling..." : "Cancel"}
                    </button>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
