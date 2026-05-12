import { useEffect, useState } from "react";
import {
  deleteNotification,
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

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      await loadItems();
      emitNotificationsUpdated();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to delete notification");
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
  
      {error && <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="mt-6 space-y-3">
        {items.length === 0 ? (
          <p className="text-slate-500">No notifications yet.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border p-4 ${
                item.read ? "border-slate-200 bg-white" : "border-red-200 bg-red-50/70"
              }`}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    {!item.read && (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                        New
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{item.message}</p>
                  <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">
                    {formatDate(item.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {!item.read && (
                    <button
                      onClick={() => handleRead(item.id)}
                      className="cursor-pointer rounded-lg bg-[#47A369] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#3b8a58]"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="cursor-pointer rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
                  >
                    Delete
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
