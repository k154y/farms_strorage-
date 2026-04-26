import { useEffect, useState } from "react";
import { getPendingApprovals, updateUserStatus } from "../../services/userService";

export default function PendingApprovalsPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const loadItems = async () => {
    try {
      const data = await getPendingApprovals();
      setItems(data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load pending approvals");
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleDecision = async (id, status) => {
    try {
      await updateUserStatus(id, status);
      await loadItems();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to update user status");
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900"></h2>
      <p className="mt-2 text-slate-500">
        Review storage owner and transporter accounts after they upload their profile documents.
      </p>

      {error && <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="mt-6 space-y-4">
        {items.length === 0 ? (
          <p className="text-slate-500">No pending accounts right now.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{item.fullName}</p>
                  <p className="text-sm text-slate-500">{item.email}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.role} | {item.status}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDecision(item.id, "ACTIVE")}
                    className="rounded-lg bg-[#47A369] px-4 py-2 text-sm font-semibold text-white"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDecision(item.id, "REJECTED")}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
