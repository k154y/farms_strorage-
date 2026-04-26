import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleMapsLocationPicker from "../../components/storage/GoogleMapsLocationPicker";
import { createFacility } from "../../services/facilityService";
import { getUser } from "../../utilis/auth";

const initialForm = {
  name: "",
  district: "",
  sector: "",
  address: "",
  latitude: "",
  longitude: "",
  description: "",
  contactPhone: "",
  contactEmail: "",
};

export default function AddFacilityPage() {
  const navigate = useNavigate();
  const user = getUser();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await createFacility({
        managerId: user?.id,
        name: form.name,
        district: form.district,
        sector: form.sector || null,
        address: form.address || null,
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
        description: form.description || null,
        contactPhone: form.contactPhone || null,
        contactEmail: form.contactEmail || null,
        active: true,
      });

      navigate("/storage/facilities");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to create facility");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">Add Facility</h2>
      <p className="mt-2 text-slate-500">
        Register a new storage facility under your manager account. Google Maps location is optional.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-4 py-3"
          placeholder="Facility Name"
          required
        />
        <input
          name="district"
          value={form.district}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-4 py-3"
          placeholder="District"
          required
        />
        <input
          name="sector"
          value={form.sector}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-4 py-3"
          placeholder="Sector"
        />
        <input
          name="contactPhone"
          value={form.contactPhone}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-4 py-3"
          placeholder="Contact Phone"
        />
        <input
          name="contactEmail"
          type="email"
          value={form.contactEmail}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-4 py-3"
          placeholder="Contact Email"
        />
        <GoogleMapsLocationPicker form={form} setForm={setForm} />
        <input
          name="latitude"
          type="number"
          step="any"
          value={form.latitude}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-4 py-3"
          placeholder="Latitude (optional)"
        />
        <input
          name="longitude"
          type="number"
          step="any"
          value={form.longitude}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-4 py-3"
          placeholder="Longitude (optional)"
        />
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-4 py-3 md:col-span-2"
          placeholder="Address"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="min-h-32 rounded-xl border border-slate-300 px-4 py-3 md:col-span-2"
          placeholder="Facility description"
        />

        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-[#47A369] px-4 py-3 font-semibold text-white md:col-span-2 disabled:opacity-60"
        >
          {submitting ? "Creating Facility..." : "Create Facility"}
        </button>
      </form>
    </div>
  );
}
