import SearchBar from "../common/SearchBar";

export default function ProductFilters({ search, setSearch }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." />
        </div>
        <select className="rounded-xl border border-slate-300 px-4 py-3">
          <option>All Categories</option>
        </select>
        <select className="rounded-xl border border-slate-300 px-4 py-3">
          <option>Location</option>
        </select>
      </div>
    </div>
  );
}