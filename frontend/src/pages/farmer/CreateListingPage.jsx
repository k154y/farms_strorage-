export default function CreateListingPage() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold">Create Listing</h2>
      <form className="mt-6 grid gap-4 md:grid-cols-2">
        <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Booking ID" />
        <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Produce Category ID" />
        <input className="rounded-xl border border-slate-300 px-4 py-3 md:col-span-2" placeholder="Product Name" />
        <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Quantity" />
        <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Price" />
        <button className="rounded-xl bg-[#47A369] px-4 py-3 text-white font-semibold md:col-span-2">Create Listing</button>
      </form>
    </div>
  );
}