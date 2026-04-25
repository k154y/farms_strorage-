import { useEffect, useState } from "react";
import { getMyNotifications, markNotificationRead } from "../../services/notificationService";
import { getUser } from "../../utilis/auth";

export default function FarmerNotificationsPage() {
  const user = getUser();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const loadItems = async () => {
    try {
      const data = await getMyNotifications(user?.id);
      setItems(data || []);
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
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to update notification");
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">Farmer Notifications</h2>
      {error && <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="mt-6 space-y-3">
        {items.length === 0 ? (
          <p className="text-slate-500">No notifications yet.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.message}</p>
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
