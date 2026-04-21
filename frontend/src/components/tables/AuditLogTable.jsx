export default function AuditLogTable({ items = [] }) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
      <table className="min-w-full">
        <thead className="bg-slate-50 text-left text-sm text-slate-600">
          <tr>
            <th className="p-4">Action</th>
            <th className="p-4">Entity</th>
            <th className="p-4">User</th>
            <th className="p-4">Date</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t border-slate-100">
              <td className="p-4">{item.action}</td>
              <td className="p-4">{item.entityType}</td>
              <td className="p-4">{item.user?.fullName || "-"}</td>
              <td className="p-4">{item.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}