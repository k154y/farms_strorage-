import { useParams } from "react-router-dom";

export default function ProductDetailsPage() {
  const { id } = useParams();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <a href="/marketplace" className="text-sm font-medium text-slate-600">
        ← Back to Marketplace
      </a>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <img
            src="https://images.unsplash.com/photo-1546094096-0df4bcaaa337?q=80&w=1200&auto=format&fit=crop"
            alt="product"
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-slate-900">Fresh Tomatoes #{id}</h1>
          <p className="mt-3 text-3xl font-black text-[#47A369]">RWF 400/kg</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">Available: 500 kg</div>
            <div className="rounded-2xl bg-slate-50 p-4">Location: Kigali</div>
            <div className="rounded-2xl bg-slate-50 p-4">Freshness: Harvested 2 days ago</div>
            <div className="rounded-2xl bg-slate-50 p-4">Farmer: Jean Farmer</div>
          </div>

          <button className="mt-6 w-full rounded-xl border border-slate-300 px-4 py-3 font-semibold">
            Call Owner: +250 788 000 000
          </button>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-bold text-slate-900">Request Order</h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Your Name" />
              <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Phone Number" />
            </div>

            <input className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3" placeholder="Quantity (kg)" />
            <textarea className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3" rows="4" placeholder="Message" />

            <button className="mt-4 w-full rounded-xl bg-[#47A369] px-6 py-3 font-semibold text-white">
              Submit Order Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}