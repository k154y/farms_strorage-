import { useEffect, useState } from "react";
import { getMyAssignedTransportRequests, getMyVehicles } from "../../services/transportService";

export default function TransporterDashboard() {
  const [stats, setStats] = useState({
    vehicles: 0,
    assignedRequests: 0,
    completedTrips: 0,
  });

  useEffect(() => {
    Promise.all([getMyVehicles(), getMyAssignedTransportRequests()])
      .then(([vehicles, requests]) => {
        const assignedRequests = (requests || []).filter((item) =>
          ["ASSIGNED", "ACCEPTED", "PICKED_UP", "DELIVERED"].includes(item.status)
        ).length;
        const completedTrips = (requests || []).filter((item) => item.status === "COMPLETED").length;

        setStats({
          vehicles: (vehicles || []).length,
          assignedRequests,
          completedTrips,
        });
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900"></h1>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {[
          ["Vehicles", stats.vehicles],
          ["Assigned Requests", stats.assignedRequests],
          ["Completed Trips", stats.completedTrips],
        ].map(([title, value]) => (
          <div key={title} className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">{title}</p>
            <p className="mt-3 text-3xl font-black text-[#304F3A]">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
