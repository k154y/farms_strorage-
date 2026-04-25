import { Link } from "react-router-dom";

// const sampleProducts = [
//   { id: 1, name: "Fresh Tomatoes", price: 400, quantityAvailable: 500, location: "Kigali" },
//   { id: 2, name: "Green Apples", price: 1200, quantityAvailable: 300, location: "Musanze" },
//   { id: 3, name: "Fresh Potatoes", price: 250, quantityAvailable: 1000, location: "Burera" },
//   { id: 4, name: "Organic Carrots", price: 600, quantityAvailable: 200, location: "Huye" },
// ];

export default function LandingPage() {
  return (
    <div>
      <section
        className="relative min-h-[78vh] bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(48,79,58,0.72), rgba(48,79,58,0.72)), url('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1600&auto=format&fit=crop')",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 py-28 text-white">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-black leading-tight md:text-7xl">
              Store Smarter.
              <br />
              Sell Faster.
            </h1>
            <p className="mt-6 text-lg text-white/90">
              A trusted platform connecting farmers with cold storage facilities,
              transport services, and a produce marketplace.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/marketplace"
                className="rounded-xl bg-[#47A369] px-6 py-3 font-semibold text-white"
              >
                Browse Products
              </Link>
              <Link
                to="/find-storage"
                className="rounded-xl bg-white px-6 py-3 font-semibold text-[#304F3A]"
              >
                Find Storage
              </Link>
              <Link
                to="/register"
                className="rounded-xl border border-white px-6 py-3 font-semibold text-white"
              >
                Register 
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-bold text-slate-900">Fresh From Farms</h2>
            <p className="mt-2 text-slate-500">Browse produce directly from verified farmers</p>
          </div>
          <Link to="/marketplace" className="font-semibold text-[#47A369]">
            View All
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {sampleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section> */}

      <section id="how-it-works" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-4xl font-bold text-slate-900">How It Works</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {[
              "Register as farmer, storage manager, or transporter",
              "Book cold storage or request transport",
              "Sell produce in the marketplace",
              "Receive orders and grow your business",
            ].map((item, idx) => (
              <div key={idx} className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-4 text-2xl font-black text-[#47A369]">0{idx + 1}</div>
                <p className="text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
