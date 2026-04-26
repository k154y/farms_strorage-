import { Bell, Menu } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../utilis/auth";
import { getUnreadNotificationsCount } from "../../services/notificationService";

export default function DashboardTopbar({ title, subtitle, onMenuToggle }) {
  const user = getUser();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const notificationPath = useMemo(() => {
    switch (user?.role) {
      case "STORAGE_MANAGER":
        return "/storage/notifications";
      case "TRANSPORTER":
        return "/transport/notifications";
      case "ADMIN":
        return "/admin/notifications";
      default:
        return "/farmer/notifications";
    }
  }, [user?.role]);

  useEffect(() => {
    let active = true;

    const loadUnreadCount = async () => {
      if (!user?.id) {
        if (active) setUnreadCount(0);
        return;
      }

      try {
        const count = await getUnreadNotificationsCount(user.id);
        if (active) {
          setUnreadCount(count);
        }
      } catch {
        if (active) {
          setUnreadCount(0);
        }
      }
    };

    loadUnreadCount();

    const handleNotificationsUpdated = () => {
      loadUnreadCount();
    };

    window.addEventListener("notifications-updated", handleNotificationsUpdated);
    const intervalId = window.setInterval(loadUnreadCount, 30000);

    return () => {
      active = false;
      window.removeEventListener("notifications-updated", handleNotificationsUpdated);
      window.clearInterval(intervalId);
    };
  }, [user?.id]);

  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="mt-1 rounded-lg border border-slate-200 bg-white p-2 text-slate-700 shadow-sm md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <div>
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 text-slate-500">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-4 self-start rounded-xl bg-white px-4 py-3 shadow-sm">
        <button
          type="button"
          onClick={() => navigate(notificationPath)}
          className="relative rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-[#47A369] hover:text-[#47A369]"
          aria-label="Open notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#47A369] px-1.5 text-[10px] font-bold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">{user?.fullName}</p>
          <p className="text-xs text-[#47A369]">{user?.role}</p>
        </div>
      </div>
    </div>
  );
}
