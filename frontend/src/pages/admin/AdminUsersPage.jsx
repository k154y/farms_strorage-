import { useEffect, useState } from "react";
import StatusBadge from "../../components/common/StatusBadge";
import { getUsers, updateUserStatus } from "../../services/userService";

export default function AdminUsersPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const loadUsers = () => {
    getUsers()
      .then((data) => setItems(data || []))
      .catch((err) => setError(err?.response?.data?.message || err?.message || "Failed to load users"));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      setError("");
      await updateUserStatus(id, status);
      loadUsers();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to update user status");
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900"></h2>
      {error && <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50 text-left text-sm text-slate-600">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-slate-100">
                <td className="p-4">{item.fullName}</td>
                <td className="p-4">{item.email}</td>
                <td className="p-4">{item.role}</td>
                <td className="p-4"><StatusBadge status={item.status} /></td>
                <td className="p-4">
                  {(item.role === "STORAGE_MANAGER" || item.role === "TRANSPORTER") && item.status !== "PENDING_APPROVAL" ? (
                    <button
                      onClick={() => handleStatusChange(item.id, "PENDING_APPROVAL")}
                      className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-white"
                    >
                      Return To Pending
                    </button>
                  ) : (
                    <span className="text-sm text-slate-400">No action</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
