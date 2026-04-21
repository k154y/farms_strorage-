export default function RegisterStoragePage() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-bold text-slate-900">Register Storage</h1>
        <p className="mt-2 text-slate-500">
          Register your facility and join the ColdChain network.
        </p>

        <form className="mt-8 grid gap-4 md:grid-cols-2">
          <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Business Name" />
          <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Owner Name" />
          <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Email" />
          <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Phone" />
          <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="District" />
          <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Sector" />
          <input className="rounded-xl border border-slate-300 px-4 py-3 md:col-span-2" placeholder="Business Address" />
          <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="RDB Registration Number" />
          <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Food Storage License ID" />
        </form>

        <button className="mt-8 rounded-xl bg-[#47A369] px-6 py-3 font-semibold text-white">
          Continue Registration
        </button>
      </div>
    </div>
  );
}