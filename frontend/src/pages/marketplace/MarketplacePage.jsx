import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "../../components/marketplace/ProductCard.jsx";
import { getListings } from "../../services/marketplaceService";

export default function MarketplacePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedQuality, setSelectedQuality] = useState("");

  useEffect(() => {
    getListings()
      .then((data) => setProducts(Array.isArray(data) ? data : data?.data || []))
      .catch((err) =>
        setError(err?.response?.data?.message || err?.message || "Failed to load listings")
      )
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () =>
      [...new Set(products.map((product) => product.produceCategory?.name).filter(Boolean))].sort(),
    [products]
  );

  const qualityOptions = useMemo(
    () => [...new Set(products.map((product) => product.qualityStatus).filter(Boolean))].sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.produceCategory?.name?.toLowerCase().includes(query) ||
        product.farmer?.fullName?.toLowerCase().includes(query);

      const matchesCategory =
        !selectedCategory || product.produceCategory?.name === selectedCategory;

      const matchesQuality =
        !selectedQuality || (product.qualityStatus || "Standard") === selectedQuality;

      return matchesSearch && matchesCategory && matchesQuality;
    });
  }, [products, searchTerm, selectedCategory, selectedQuality]);

  return (
    <div className="bg-[#f7fafc]">
      <section className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2f855a]">
                Marketplace
              </p>
              <h1 className="mt-4 text-4xl font-medium tracking-[-0.05em] text-[#1a202c] sm:text-5xl">
                Fresh produce from active farmer listings.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                Browse available stock, compare product quality, and contact-ready listings without digging through separate channels.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200/80 bg-[#f7fafc] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-3 text-[#2f855a]">
                <SlidersHorizontal className="h-5 w-5" />
                <p className="text-sm font-semibold uppercase tracking-[0.18em]">
                  Live browse
                </p>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <div>
                  <p className="text-sm text-slate-500">Visible listings</p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-900">
                    {filteredProducts.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Categories</p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-900">
                    {categories.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Farmer listings</p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-900">
                    {products.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
        <div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_0.8fr_0.8fr_auto]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-11 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2f855a] focus:bg-white focus:ring-4 focus:ring-[#2f855a]/10"
                placeholder="Search by product, category, or farmer"
              />
            </label>

            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-[#2f855a] focus:bg-white focus:ring-4 focus:ring-[#2f855a]/10"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={selectedQuality}
              onChange={(event) => setSelectedQuality(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-[#2f855a] focus:bg-white focus:ring-4 focus:ring-[#2f855a]/10"
            >
              <option value="">All quality levels</option>
              {qualityOptions.map((quality) => (
                <option key={quality} value={quality}>
                  {quality}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
                setSelectedQuality("");
              }}
              className="rounded-2xl border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-[#2f855a]/30 hover:text-[#2f855a]"
            >
              Clear
            </button>
          </div>
        </div>

        {loading ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
              >
                <div className="h-56 animate-pulse bg-slate-200" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {error ? (
          <div className="mt-10 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        ) : null}

        {!loading && !error ? (
          <>
            <div className="mt-8 flex items-center justify-between gap-4">
              <p className="text-sm text-slate-500">
                Showing <span className="font-semibold text-slate-900">{filteredProducts.length}</span> active listings
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="mt-8 rounded-[1.75rem] border border-slate-200/80 bg-white px-6 py-16 text-center shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                <h2 className="text-2xl font-medium tracking-[-0.03em] text-slate-900">
                  No listings match your filters.
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Try a different category, remove the quality filter, or search with fewer words.
                </p>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        ) : null}
      </section>
    </div>
  );
}
