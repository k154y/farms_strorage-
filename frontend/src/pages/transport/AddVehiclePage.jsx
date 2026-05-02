import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createVehicle } from "../../services/transportService";
import { getTransporterProfile } from "../../services/transporterProfileService";
import { getUser } from "../../utilis/auth";

const vehicleTypes = ["TRUCK", "VAN", "PICKUP", "MOTORBIKE", "OTHER"];

const initialForm = {
  plateNumber: "",
  vehicleType: vehicleTypes[0],
  capacity: "",
  ownershipDocumentPath: "",
};

export default function AddVehiclePage() {
  const user = getUser();
  const [profileComplete, setProfileComplete] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getTransporterProfile()
      .then((data) => setProfileComplete(Boolean(data?.profileComplete)))
      .catch(() => setProfileComplete(false))
      .finally(() => setLoadingProfile(false));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      await createVehicle({
        transporterId: user?.id,
        plateNumber: form.plateNumber,
        vehicleType: form.vehicleType,
        capacity: Number(form.capacity),
        ownershipDocumentPath: form.ownershipDocumentPath || null,
        active: true,
      });

      setMessage("Vehicle saved successfully.");
      setForm(initialForm);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to save vehicle");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold">Add Vehicle</h2>
      {!loadingProfile && !profileComplete ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Complete your transporter profile first before adding a vehicle.{" "}
          <Link to="/transport/profile" className="font-semibold text-[#2d6a47]">
            Go to profile
          </Link>
        </div>
      ) : null}
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <input
          name="plateNumber"
          value={form.plateNumber}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-4 py-3"
          placeholder="Plate Number"
          required
        />
        <select
          name="vehicleType"
          value={form.vehicleType}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-4 py-3"
        >
          {vehicleTypes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <input
          name="capacity"
          type="number"
          min="0.01"
          step="0.01"
          value={form.capacity}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-4 py-3"
          placeholder="Capacity"
          required
        />
        <input
          name="ownershipDocumentPath"
          value={form.ownershipDocumentPath}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-4 py-3"
          placeholder="Ownership document path or URL"
        />
        {message && <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 md:col-span-2">{message}</div>}
        {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2">{error}</div>}
        <button
          type="submit"
          disabled={submitting || loadingProfile || !profileComplete}
          className="rounded-xl bg-[#47A369] px-4 py-3 text-white font-semibold disabled:opacity-60 md:col-span-2"
        >
          {submitting ? "Saving..." : "Save Vehicle"}
        </button>
      </form>
    </div>
  );
}
