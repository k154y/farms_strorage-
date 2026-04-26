import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getColdRooms, getFacilityById, getFacilityPhotos } from "../../services/facilityService";

export default function FacilityDetailPage() {
  const { id } = useParams();
  const [facility, setFacility] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      getFacilityById(id),
      getColdRooms(),
      getFacilityPhotos(id).catch(() => []),
    ])
      .then(([facilityData, roomData, photoData]) => {
        setFacility(facilityData);
        setRooms((roomData || []).filter((room) => String(room.facility?.id) === String(id)));
        setPhotos(photoData || []);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err?.message || "Failed to load facility details");
      });
  }, [id]);

  if (error) {
    return <div className="rounded-2xl bg-red-50 p-6 text-red-700 shadow-sm">{error}</div>;
  }

  if (!facility) {
    return <div className="rounded-2xl bg-white p-6 shadow-sm text-slate-500">Loading facility details...</div>;
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <img
          src={
            photos?.[0]?.filePath ||
            "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1600&auto=format&fit=crop"
          }
          alt={facility.name}
          className="h-72 w-full object-cover md:h-96"
        />
        <div className="p-6">
          <h2 className="text-3xl font-bold text-slate-900">{facility.name}</h2>
          <p className="mt-2 text-slate-600">{facility.description || "No description provided yet."}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">District</p>
              <p className="mt-2 font-semibold text-slate-900">{facility.district || "N/A"}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Sector</p>
              <p className="mt-2 font-semibold text-slate-900">{facility.sector || "N/A"}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Contact Phone</p>
              <p className="mt-2 font-semibold text-slate-900">{facility.contactPhone || "N/A"}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Contact Email</p>
              <p className="mt-2 font-semibold text-slate-900">{facility.contactEmail || "N/A"}</p>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">Address:</span> {facility.address || "Not provided"}
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900">Cold Rooms</h3>
        {rooms.length === 0 ? (
          <p className="mt-4 text-slate-500">No cold rooms have been added to this facility yet.</p>
        ) : (
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {rooms.map((room) => (
              <div key={room.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">{room.name}</h4>
                    <p className="mt-1 text-sm text-slate-500">{room.code}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${room.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {room.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <p>Total capacity: {room.totalCapacity}</p>
                  <p>Available capacity: {room.availableCapacity}</p>
                  <p>Pricing type: {room.pricingType}</p>
                  <p>Price per unit: {room.pricePerUnit}</p>
                  <p>Min temperature: {room.minTemperature ?? "N/A"}</p>
                  <p>Max temperature: {room.maxTemperature ?? "N/A"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
