import { isAuthenticated } from "../../utils/auth";
import { Navigate } from "react-router-dom";

export default function BookStoragePage() {
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
    </div>
  );
}