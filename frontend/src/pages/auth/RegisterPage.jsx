import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  registerFarmer,
  registerStorageManager,
  registerTransporter,
} from "../../services/authService";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("FARMER");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    businessName: "",
    rdbRegistrationNumber: "",
    drivingLicenseNumber: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const updateField = (name, value) => setForm((current) => ({ ...current, [name]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      if (role === "FARMER") {
        await registerFarmer({
          fullName: form.fullName,
          email: form.email,
          phoneNumber: form.phoneNumber,
          password: form.password,
        });
      } else if (role === "STORAGE_MANAGER") {
        await registerStorageManager({
          fullName: form.fullName,
          email: form.email,
          phoneNumber: form.phoneNumber,
          password: form.password,
          businessName: form.businessName,
          rdbRegistrationNumber: form.rdbRegistrationNumber,
        });
      } else {
        await registerTransporter({
          fullName: form.fullName,
          email: form.email,
          phoneNumber: form.phoneNumber,
          password: form.password,
          businessName: form.businessName,
          drivingLicenseNumber: form.drivingLicenseNumber,
        });
      }

      setMessage(
        role === "FARMER"
          ? "Farmer account created successfully. You can now log in."
          : "Account created successfully. Log in next, open Profile, upload the required documents, then wait for admin approval."
      );
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold text-slate-900">Create Account</h1>
        <p className="mt-2 text-slate-500">
          Register as farmer, storage manager, or transporter.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {["FARMER", "STORAGE_MANAGER", "TRANSPORTER"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`rounded-2xl border p-5 text-left font-semibold ${
                role === r
                  ? "border-[#47A369] bg-[#47A369]/10 text-[#304F3A]"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              {r.replace("_", " ")}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Full Name" value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} required />
            <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Email" type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} required />
            <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Phone Number" value={form.phoneNumber} onChange={(e) => updateField("phoneNumber", e.target.value)} required />
            <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Password" type="password" value={form.password} onChange={(e) => updateField("password", e.target.value)} required />
          </div>

          {role === "STORAGE_MANAGER" && (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Business Name" value={form.businessName} onChange={(e) => updateField("businessName", e.target.value)} required />
              <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="RDB Registration Number" value={form.rdbRegistrationNumber} onChange={(e) => updateField("rdbRegistrationNumber", e.target.value)} />
            </div>
          )}

          {role === "TRANSPORTER" && (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Business Name" value={form.businessName} onChange={(e) => updateField("businessName", e.target.value)} />
              <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Driving License Number" value={form.drivingLicenseNumber} onChange={(e) => updateField("drivingLicenseNumber", e.target.value)} />
            </div>
          )}

          {message && <div className="mt-6 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}
          {error && <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <button className="mt-8 rounded-xl bg-[#47A369] px-6 py-3 font-semibold text-white disabled:opacity-70" disabled={submitting}>
            {submitting ? "Creating Account..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
