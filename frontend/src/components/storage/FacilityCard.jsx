import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFacilityPhotos } from "../../services/facilityService";

export default function FacilityCard({ facility, showLink = true, distanceKm = null }) {
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    let active = true;

    getFacilityPhotos(facility.id)
      .then((items) => {
        if (!active) return;
        setPhotoUrl(items?.[0]?.filePath || "");
      })
      .catch(() => {
        if (!active) return;
        setPhotoUrl("");
      });

    return () => {
      active = false;
    };
  }, [facility.id]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <img
        src={photoUrl || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1200&auto=format&fit=crop"}
        alt={facility.name}
        className="h-52 w-full object-cover"
      />
      <div className="p-5">
      <h3 className="text-lg font-semibold text-slate-900">{facility.name}</h3>
      <p className="mt-2 text-sm text-slate-500">{facility.district} {facility.sector ? `, ${facility.sector}` : ""}</p>
      {distanceKm != null && (
        <p className="mt-1 text-sm font-medium text-[#47A369]">
          {distanceKm.toFixed(1)} km from you
        </p>
      )}
      <p className="mt-2 text-sm text-slate-600">{facility.description || "No description"}</p>
      {showLink && (
        <Link to={`/storage/facilities/${facility.id}`} className="mt-4 inline-block font-semibold text-[#47A369]">
          View Facility
        </Link>
      )}
      </div>
    </div>
  );
}
