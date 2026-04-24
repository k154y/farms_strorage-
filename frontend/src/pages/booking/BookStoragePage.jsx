import { isAuthenticated } from "../../utilis/auth";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import FacilityCard from "../../components/storage/FacilityCard";
import { getFacilities } from "../../services/facilityService";
import { getUsers } from "../../services/userService";

export default function BookStoragePage() {
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    Promise.all([getFacilities(), getUsers({ role: "STORAGE_MANAGER", status: "ACTIVE" })])
      .then(([facilityData, activeManagers]) => {
        const managerIds = (activeManagers || []).map((manager) => manager.id);
        setFacilities((facilityData || []).filter((facility) => facility.active && managerIds.includes(facility.manager?.id)));
      })
      .catch(console.error);
  }, []);

  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-bold text-slate-900">Find & Book Storage</h1>
      <p className="mt-2 text-slate-500">
        Search available facilities and create a booking.
      </p>

      <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <select className="rounded-xl border border-slate-300 px-4 py-3">
            <option>Select Produce Category</option>
          </select>
          <select className="rounded-xl border border-slate-300 px-4 py-3">
            <option>Select District</option>
          </select>
          <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Quantity" />
          <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Expected Duration Days" />
        </div>

        <button className="mt-6 rounded-xl bg-[#47A369] px-6 py-3 font-semibold text-white">
          Search Storage
        </button>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {facilities.map((facility) => (
          <FacilityCard key={facility.id} facility={facility} showLink={false} />
        ))}
      </div>
    </div>
  );
}
