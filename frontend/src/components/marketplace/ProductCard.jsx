import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getListingImages } from "../../services/marketplaceService";

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
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <img
        src={imageUrl || "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?q=80&w=1200&auto=format&fit=crop"}
        alt={product.name}
        className="h-64 w-full object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
        <p className="mt-1 text-xl font-bold text-[#47A369]">RWF {product.price}/kg</p>
        <p className="mt-2 text-sm text-slate-500">{product.location || "Kigali"}</p>
        <p className="text-sm text-slate-500">{product.quantityAvailable} kg</p>

        <div className="mt-4 flex gap-3">
          <Link
            to={`/marketplace/${product.id}`}
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-medium"
          >
            View Details
          </Link>
          <Link
            to={`/marketplace/${product.id}`}
            className="flex-1 rounded-lg bg-[#47A369] px-4 py-2 text-center text-sm font-semibold text-white"
          >
            Request Order
          </Link>
        </div>
      </div>
    </div>
  );
}
