export default function TransporterDashboard() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900">Transporter Dashboard</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {["Vehicles", "Assigned Requests", "Completed Trips"].map((title) => (
          <div key={title} className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">{title}</p>
            <p className="mt-3 text-3xl font-black text-[#304F3A]">0</p>
          </div>
        ))}
      </div>
    </div>
  );
}
