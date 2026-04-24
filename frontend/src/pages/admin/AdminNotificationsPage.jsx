import { useEffect, useState } from "react";
import { getMyNotifications } from "../../services/notificationService";
import { getUser } from "../../utilis/auth";

export default function AdminNotificationsPage() {
  const user = getUser();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyNotifications(user?.id)
      .then((data) => setItems(data || []))
      .catch((err) => setError(err?.response?.data?.message || err?.message || "Failed to load notifications"));
  }, [user?.id]);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
      {error && <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="mt-6 space-y-3">
        {items.length === 0 ? (
          <p className="text-slate-500">No notifications yet.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-200 p-4">
              <p className="font-semibold text-slate-900">{item.title}</p>
              <p className="mt-1 text-sm text-slate-600">{item.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
