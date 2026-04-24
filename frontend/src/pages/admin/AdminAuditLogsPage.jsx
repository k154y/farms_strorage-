import { useEffect, useState } from "react";
import AuditLogTable from "../../components/tables/AuditLogTable";
import { getAuditLogs } from "../../services/userService";

export default function AdminAuditLogsPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getAuditLogs()
      .then((data) => setItems(data || []))
      .catch((err) => setError(err?.response?.data?.message || err?.message || "Failed to load audit logs"));
  }, []);

  return (
    <div className="space-y-4">
      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <AuditLogTable items={items} />
    </div>
  );
}
