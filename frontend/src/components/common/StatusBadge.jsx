export default function StatusBadge({ status }) {
  const map = {
    PENDING: "bg-amber-100 text-amber-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
    ACTIVE: "bg-green-100 text-green-700",
    ASSIGNED: "bg-sky-100 text-sky-700",
    ACCEPTED: "bg-cyan-100 text-cyan-700",
    PICKED_UP: "bg-indigo-100 text-indigo-700",
    COMPLETED: "bg-emerald-100 text-emerald-700",
    CANCELLED: "bg-slate-200 text-slate-700",
    DELIVERED: "bg-blue-100 text-blue-700",
    IN_STORAGE: "bg-violet-100 text-violet-700",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${map[status] || "bg-slate-100 text-slate-700"}`}>
      {status}
    </span>
  );
}
