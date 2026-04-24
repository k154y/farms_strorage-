import { useEffect, useState } from "react";
import ColdRoomCard from "../../components/storage/ColdRoomCard";
import { createColdRoom, getColdRooms, getFacilities } from "../../services/facilityService";
import { getUser } from "../../utilis/auth";

const initialForm = {
  facilityId: "",
  code: "",
  name: "",
  totalCapacity: "",
  availableCapacity: "",
  minTemperature: "",
  maxTemperature: "",
  pricingType: "PER_DAY",
  pricePerUnit: "",
};

export default function ColdRoomsPage() {
  const [items, setItems] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const user = getUser();

  const loadData = () => {
    Promise.all([getColdRooms(), getFacilities()])
      .then(([coldRoomsRes, facilitiesRes]) => {
        const coldRooms = coldRoomsRes.data || coldRoomsRes || [];
        const managerFacilities = (facilitiesRes.data || facilitiesRes || []).filter(
          (facility) => facility.manager?.id === user?.id
        );

        setFacilities(managerFacilities);
        setItems(
          coldRooms.filter((room) =>
            managerFacilities.some((facility) => facility.id === room.facility?.id)
          )
        );
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await createColdRoom({
        facilityId: Number(form.facilityId),
        code: form.code,
        name: form.name,
        totalCapacity: Number(form.totalCapacity),
        availableCapacity: Number(form.availableCapacity),
        minTemperature: form.minTemperature ? Number(form.minTemperature) : null,
        maxTemperature: form.maxTemperature ? Number(form.maxTemperature) : null,
        pricingType: form.pricingType,
        pricePerUnit: Number(form.pricePerUnit),
        active: true,
      });
      setForm(initialForm);
      loadData();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to create cold room");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Register Cold Room</h2>
        <p className="mt-2 text-slate-500">Every cold room must be registered under one of your facilities.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <select
            value={form.facilityId}
            onChange={(e) => setForm((current) => ({ ...current, facilityId: e.target.value }))}
            className="rounded-xl border border-slate-300 px-4 py-3"
            required
          >
            <option value="">Select Facility</option>
            {facilities.map((facility) => (
              <option key={facility.id} value={facility.id}>
                {facility.name}
              </option>
            ))}
          </select>
          <input value={form.code} onChange={(e) => setForm((c) => ({ ...c, code: e.target.value }))} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Room Code" required />
          <input value={form.name} onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Room Name" required />
          <input type="number" step="0.01" value={form.totalCapacity} onChange={(e) => setForm((c) => ({ ...c, totalCapacity: e.target.value }))} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Total Capacity" required />
          <input type="number" step="0.01" value={form.availableCapacity} onChange={(e) => setForm((c) => ({ ...c, availableCapacity: e.target.value }))} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Available Capacity" required />
          <select value={form.pricingType} onChange={(e) => setForm((c) => ({ ...c, pricingType: e.target.value }))} className="rounded-xl border border-slate-300 px-4 py-3" required>
            {["PER_DAY", "PER_WEEK", "PER_MONTH", "PER_KG", "PER_TON"].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <input type="number" step="0.01" value={form.pricePerUnit} onChange={(e) => setForm((c) => ({ ...c, pricePerUnit: e.target.value }))} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Price Per Unit" required />
          <input type="number" step="0.01" value={form.minTemperature} onChange={(e) => setForm((c) => ({ ...c, minTemperature: e.target.value }))} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Min Temperature" />
          <input type="number" step="0.01" value={form.maxTemperature} onChange={(e) => setForm((c) => ({ ...c, maxTemperature: e.target.value }))} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Max Temperature" />
        </div>
        {error && <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        <button type="submit" disabled={submitting} className="mt-6 rounded-xl bg-[#47A369] px-5 py-3 font-semibold text-white disabled:opacity-60">
          {submitting ? "Registering..." : "Register Cold Room"}
        </button>
      </form>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{items.map((r) => <ColdRoomCard key={r.id} room={r} />)}</div>
    </div>
  );
}
