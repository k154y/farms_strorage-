import { Link } from "react-router-dom";
import StatusBadge from "../common/StatusBadge";

export default function TransportTable({ items = [] }) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
      <table className="min-w-full">
        <thead className="bg-slate-50 text-left text-sm text-slate-600">
          <tr>
            <th className="p-4">ID</th>
            <th className="p-4">Pickup</th>
            <th className="p-4">Destination</th>
            <th className="p-4">Status</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t border-slate-100">
              <td className="p-4">{item.id}</td>
              <td className="p-4">{item.pickupLocation}</td>
              <td className="p-4">{item.destinationLocation}</td>
              <td className="p-4"><StatusBadge status={item.status} /></td>
              <td className="p-4">
                <Link to={`/transport/requests/${item.id}`} className="text-[#47A369] font-semibold">View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}