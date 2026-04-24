import { useEffect, useState } from "react";
import { getPendingApprovals, getUsers } from "../../services/userService";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    pending: 0,
    storageManagers: 0,
    transporters: 0,
  });

  useEffect(() => {
    Promise.all([
      getUsers(),
      getPendingApprovals(),
      getUsers({ role: "STORAGE_MANAGER" }),
      getUsers({ role: "TRANSPORTER" }),
    ])
      .then(([users, pending, storageManagers, transporters]) => {
        setStats({
          users: users.length,
          pending: pending.length,
          storageManagers: storageManagers.length,
          transporters: transporters.length,
        });
      })
      .catch(console.error);
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-4">
      {[
        ["Users", stats.users],
        ["Pending Approvals", stats.pending],
        ["Storage Owners", stats.storageManagers],
        ["Transporters", stats.transporters],
      ].map(([title, value]) => (
        <div key={title} className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-black text-[#304F3A]">{value}</p>
        </div>
      ))}
    </div>
  );
}
