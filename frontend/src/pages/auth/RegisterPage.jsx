import { useState } from "react";

export default function RegisterPage() {
  const [role, setRole] = useState("FARMER");

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

        <form className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Full Name" />
            <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Email" />
            <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Phone Number" />
            <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Password" type="password" />
          </div>

          {role === "STORAGE_MANAGER" && (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Business Name" />
              <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="RDB Registration Number" />
            </div>
          )}

          {role === "TRANSPORTER" && (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Business Name" />
              <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Driving License Number" />
            </div>
          )}

          <button className="mt-8 rounded-xl bg-[#47A369] px-6 py-3 font-semibold text-white">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}