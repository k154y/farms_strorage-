import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Package2, ShieldCheck } from "lucide-react";
import { getListingImages } from "../../services/marketplaceService";

function formatQuantity(value) {
  if (value == null) {
    return "Not specified";
  }

  return Number.isInteger(Number(value)) ? Number(value) : Number(value).toFixed(1);
}

export default function ProductCard({ product }) {
  const [imageUrl, setImageUrl] = useState(product.imageUrl || "");

  useEffect(() => {
    let active = true;

    getListingImages(product.id)
      .then((items) => {
        if (!active) return;
        setImageUrl(items?.[0]?.filePath || product.imageUrl || "");
      })
      .catch(() => {
        if (!active) return;
        setImageUrl(product.imageUrl || "");
      });

    return () => {
      active = false;
    };
  }, [product.id, product.imageUrl]);

  return (
    <div className="group overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_14px_36px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(15,23,42,0.12)]">
      <div className="relative overflow-hidden">
        <img
          src={imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop"}
          alt={product.name}
          className="h-60 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/92 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
          <Leaf className="h-3.5 w-3.5 text-[#2f855a]" />
          {product.produceCategory?.name || "Produce"}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-900">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              by {product.farmer?.fullName || "Farmer listing"}
            </p>
          </div>
          <p className="text-lg font-semibold text-[#2f855a]">
            RWF {product.price}/{product.unit || "kg"}
          </p>
        </div>

        {product.description ? (
          <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
            {product.description}
          </p>
        ) : (
          <p className="mt-4 text-sm leading-6 text-slate-500">
            Fresh produce listing ready for buyer requests.
          </p>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-[#f7fafc] px-4 py-3">
            <div className="flex items-center gap-2 text-slate-500">
              <Package2 className="h-4 w-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.16em]">Available</p>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {formatQuantity(product.quantityAvailable)} {product.unit || "kg"}
            </p>
          </div>
          <div className="rounded-2xl bg-[#f7fafc] px-4 py-3">
            <div className="flex items-center gap-2 text-slate-500">
              <ShieldCheck className="h-4 w-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.16em]">Quality</p>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {product.qualityStatus || "Standard"}
            </p>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <Link
            to={`/marketplace/${product.id}`}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-[#2f855a]/30 hover:text-[#2f855a]"
          >
            View Details
          </Link>
          <Link
            to={`/marketplace/${product.id}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2f855a] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(47,133,90,0.22)] transition hover:bg-[#276e4b]"
          >
            Request Order
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
