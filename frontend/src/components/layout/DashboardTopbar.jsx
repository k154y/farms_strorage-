import { Bell, Menu } from "lucide-react";
import { getUser } from "../../utilis/auth";

export default function DashboardTopbar({ title, subtitle, onMenuToggle }) {
  const user = getUser();

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
        <Bell size={18} className="text-slate-600" />
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">{user?.fullName}</p>
          <p className="text-xs text-[#47A369]">{user?.role}</p>
        </div>
      </div>
    </div>
  );
}
