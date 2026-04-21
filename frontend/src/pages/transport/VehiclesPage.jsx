import { useEffect, useState } from "react";
import { getVehicles } from "../../services/transportService";

export default function VehiclesPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getVehicles().then((res) => setItems(res.data || res)).catch(console.error);
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {items.map((v) => (
        <div key={v.id} className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">{v.plateNumber}</h3>
          <p className="text-slate-500">{v.vehicleType}</p>
          <p className="mt-2">Capacity: {v.capacity}</p>
        </div>
      ))}
    </div>
  );
}