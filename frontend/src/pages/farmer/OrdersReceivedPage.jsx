import { useEffect, useState } from "react";
import StatusBadge from "../../components/common/StatusBadge";
import { getOrdersReceived } from "../../services/marketplaceService";

export default function OrdersReceivedPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrdersReceived()
      .then((data) => setItems(data || []))
      .catch((err) => setError(err?.response?.data?.message || err?.message || "Failed to load received orders"));
  }, []);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">Orders Received</h2>
      <p className="mt-2 text-slate-500">Marketplace buyer requests for your product listings.</p>

      {error && <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50 text-left text-sm text-slate-600">
            <tr>
              <th className="p-4">Listing</th>
              <th className="p-4">Buyer</th>
              <th className="p-4">Quantity</th>
              <th className="p-4">Delivery Location</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-slate-100">
                <td className="p-4">{item.productListing?.name || `Listing #${item.productListing?.id}`}</td>
                <td className="p-4">
                  <div className="text-sm text-slate-900">{item.buyerName}</div>
                  <div className="text-xs text-slate-500">{item.buyerPhone}</div>
                  <div className="text-xs text-slate-500">{item.buyerEmail || "No email"}</div>
                </td>
                <td className="p-4">{item.requestedQuantity}</td>
                <td className="p-4">{item.deliveryLocation || "Not specified"}</td>
                <td className="p-4"><StatusBadge status={item.status} /></td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-slate-500">
                  No marketplace orders received yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
