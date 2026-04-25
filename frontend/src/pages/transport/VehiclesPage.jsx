import { useEffect, useState } from "react";
import { getMyVehicles } from "../../services/transportService";

export default function VehiclesPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyVehicles()
      .then((res) => setItems(res || []))
      .catch((err) => {
        setError(err?.response?.data?.message || err?.message || "Failed to load vehicles");
      });
  }, []);

  return (
    <div className="space-y-4">
      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {items.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm text-slate-500">
          No vehicles found for this transporter account yet.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((v) => (
            <div key={v.id} className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">{v.plateNumber}</h3>
              <p className="text-slate-500">{v.vehicleType}</p>
              <p className="mt-2">Capacity: {v.capacity}</p>
              <p className="mt-2 text-sm text-slate-500">Status: {v.active ? "Active" : "Inactive"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
