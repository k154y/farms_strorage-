import { Link } from "react-router-dom";

export default function FacilityCard({ facility }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{facility.name}</h3>
      <p className="mt-2 text-sm text-slate-500">{facility.district} {facility.sector ? `, ${facility.sector}` : ""}</p>
      <p className="mt-2 text-sm text-slate-600">{facility.description || "No description"}</p>
      <Link to={`/storage/facilities/${facility.id}`} className="mt-4 inline-block font-semibold text-[#47A369]">
        View Facility
      </Link>
    </div>
  );
}