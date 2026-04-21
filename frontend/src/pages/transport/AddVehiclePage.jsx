export default function AddVehiclePage() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold">Add Vehicle</h2>
      <form className="mt-6 grid gap-4 md:grid-cols-2">
        <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Plate Number" />
        <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Vehicle Type" />
        <input className="rounded-xl border border-slate-300 px-4 py-3 md:col-span-2" placeholder="Capacity" />
        <button className="rounded-xl bg-[#47A369] px-4 py-3 text-white font-semibold md:col-span-2">Save Vehicle</button>
      </form>
    </div>
  );
}