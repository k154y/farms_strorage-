import { useEffect, useState } from "react";
import ProductCard from "../../components/marketplace/ProductCard";
import { getListings } from "../../services/marketplaceService";

export default function MarketplacePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getListings()
      .then((data) => setProducts(Array.isArray(data) ? data : data?.data || []))
      .catch((err) => setError(err?.response?.data?.message || err?.message || "Failed to load listings"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-4xl font-bold text-slate-900">Marketplace</h1>
      <p className="mt-2 text-slate-500">Fresh produce directly from farmers</p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid gap-4 md:grid-cols-4">
          <input className="rounded-xl border border-slate-300 px-4 py-3 md:col-span-2" placeholder="Search products..." />
          <select className="rounded-xl border border-slate-300 px-4 py-3">
            <option>All Categories</option>
          </select>
          <select className="rounded-xl border border-slate-300 px-4 py-3">
            <option>Location</option>
          </select>
        </div>
      </div>

      {loading ? <p className="mt-10 text-slate-500">Loading listings...</p> : null}
      {error ? <div className="mt-10 rounded-xl bg-red-50 px-4 py-3 text-red-700">{error}</div> : null}

      {!loading && !error ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
