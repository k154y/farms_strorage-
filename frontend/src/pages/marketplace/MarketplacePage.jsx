import ProductCard from "../../components/marketplace/ProductCard";

const products = [
  { id: 1, name: "Fresh Tomatoes", price: 400, quantityAvailable: 500, location: "Kigali" },
  { id: 2, name: "Green Apples", price: 1200, quantityAvailable: 300, location: "Musanze" },
  { id: 3, name: "Fresh Potatoes", price: 250, quantityAvailable: 1000, location: "Burera" },
  { id: 4, name: "Organic Carrots", price: 600, quantityAvailable: 200, location: "Huye" },
];

export default function MarketplacePage() {
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

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}