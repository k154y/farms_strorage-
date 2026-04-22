import { Bell } from "lucide-react";
import { getUser } from "../../utilis/auth";

export default function DashboardTopbar({ title, subtitle }) {
  const user = getUser();

  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-2 text-slate-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4 rounded-xl bg-white px-4 py-3 shadow-sm">
        <Bell size={18} className="text-slate-600" />
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">{user?.fullName}</p>
          <p className="text-xs text-[#47A369]">{user?.role}</p>
        </div>
      </div>
    </div>
  );
}
