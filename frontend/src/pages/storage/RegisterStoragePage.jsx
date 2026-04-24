import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerStorageManager } from "../../services/authService";

export default function RegisterStoragePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    ownerName: "",
    email: "",
    phoneNumber: "",
    district: "",
    sector: "",
    businessAddress: "",
    businessName: "",
    rdbRegistrationNumber: "",
    fdaLicenseId: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const updateField = (name, value) => setForm((current) => ({ ...current, [name]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      await registerStorageManager({
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
        businessName: form.businessName,
        ownerName: form.ownerName,
        businessAddress: form.businessAddress,
        district: form.district,
        sector: form.sector,
        contactPhone: form.phoneNumber,
        rdbRegistrationNumber: form.rdbRegistrationNumber,
        fdaLicenseId: form.fdaLicenseId,
      });

      setMessage("Storage manager account created. You can now log in.");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-bold text-slate-900">Register Storage</h1>
        <p className="mt-2 text-slate-500">
          Register your facility and join the ColdChain network.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
          <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Full Name" value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} required />
          <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Owner Name" value={form.ownerName} onChange={(e) => updateField("ownerName", e.target.value)} />
          <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Business Name" value={form.businessName} onChange={(e) => updateField("businessName", e.target.value)} required />
          <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Email" type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} required />
          <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Phone" value={form.phoneNumber} onChange={(e) => updateField("phoneNumber", e.target.value)} required />
          <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Password" type="password" value={form.password} onChange={(e) => updateField("password", e.target.value)} required />
          <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="District" value={form.district} onChange={(e) => updateField("district", e.target.value)} required />
          <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Sector" value={form.sector} onChange={(e) => updateField("sector", e.target.value)} />
          <input className="rounded-xl border border-slate-300 px-4 py-3 md:col-span-2" placeholder="Business Address" value={form.businessAddress} onChange={(e) => updateField("businessAddress", e.target.value)} />
          <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="RDB Registration Number" value={form.rdbRegistrationNumber} onChange={(e) => updateField("rdbRegistrationNumber", e.target.value)} />
          <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Food Storage License ID" value={form.fdaLicenseId} onChange={(e) => updateField("fdaLicenseId", e.target.value)} />

          {message && <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 md:col-span-2">{message}</div>}
          {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2">{error}</div>}

          <button className="rounded-xl bg-[#47A369] px-6 py-3 font-semibold text-white md:col-span-2 disabled:opacity-70" disabled={submitting}>
            {submitting ? "Submitting..." : "Continue Registration"}
          </button>
        </form>
      </div>
    </div>
  );
}
