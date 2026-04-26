import { useEffect, useState } from "react";
import {
  emitNotificationsUpdated,
  getMyNotifications,
  markNotificationRead,
} from "../../services/notificationService";
import { getUser } from "../../utilis/auth";

function formatDate(value) {
  if (!value) return "Unknown time";
  return new Date(value).toLocaleString();
}

export default function TransportNotificationsPage() {
  const user = getUser();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const loadItems = async () => {
    try {
      const data = await getMyNotifications(user?.id);
      setItems(data || []);
      emitNotificationsUpdated();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load notifications");
    }
  };

  useEffect(() => {
    loadItems();
  }, [user?.id]);

  const handleRead = async (id) => {
    try {
      await markNotificationRead(id);
      await loadItems();
      emitNotificationsUpdated();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to update notification");
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">Transporter Notifications</h2>
      <p className="mt-2 text-slate-500">
        Review transport updates, assignment changes, and document feedback from admin.
      </p>
      {error && <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="mt-6 space-y-3">
        {items.length === 0 ? (
          <p className="text-slate-500">No notifications yet.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    {!item.read && (
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                        New
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{item.message}</p>
                  <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">
                    {formatDate(item.createdAt)}
                  </p>
                </div>
                {!item.read && (
                  <button
                    onClick={() => handleRead(item.id)}
                    className="rounded-lg bg-[#47A369] px-3 py-2 text-xs font-semibold text-white"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
