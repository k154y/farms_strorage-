export default function CreateTransportRequestPage() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold">Create Transport Request</h2>
      <form className="mt-6 grid gap-4 md:grid-cols-2">
        <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Booking ID" />
        <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Quantity" />
        <input className="rounded-xl border border-slate-300 px-4 py-3 md:col-span-2" placeholder="Pickup Location" />
        <input className="rounded-xl border border-slate-300 px-4 py-3 md:col-span-2" placeholder="Destination Location" />
        <button className="rounded-xl bg-[#47A369] px-4 py-3 text-white font-semibold md:col-span-2">Submit</button>
      </form>
    </div>
  );
}