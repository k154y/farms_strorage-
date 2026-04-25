import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import OrderRequestForm from "../../components/marketplace/OrderRequestForm";
import {
  createOrderRequest,
  getListingById,
  getListingImages,
} from "../../services/marketplaceService";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getListingById(id), getListingImages(id).catch(() => [])])
      .then(([data, images]) => {
        setProduct(data);
        setImageUrl(images?.[0]?.filePath || data?.imageUrl || "");
      })
      .catch((err) => setError(err?.response?.data?.message || err?.message || "Failed to load listing"));
  }, [id]);

  const handleSubmit = async (form) => {
    setMessage("");
    setError("");

    try {
      await createOrderRequest({
        productListingId: Number(id),
        buyerName: form.buyerName,
        buyerPhone: form.buyerPhone,
        buyerEmail: form.buyerEmail,
        requestedQuantity: Number(form.requestedQuantity),
        message: form.message,
        deliveryLocation: form.deliveryLocation,
      });
      setMessage("Order request submitted successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to submit order request");
    }
  };

  if (!product && !error) {
    return <div className="mx-auto max-w-7xl px-6 py-12">Loading product...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <Link to="/marketplace" className="text-sm font-medium text-slate-600">
        Back to Marketplace
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <img
            src={imageUrl || "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?q=80&w=1200&auto=format&fit=crop"}
            alt={product?.name || "product"}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-slate-900">{product?.name || `Product #${id}`}</h1>
          <p className="mt-3 text-3xl font-black text-[#47A369]">
            RWF {product?.price}/{product?.unit || "kg"}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">Available: {product?.quantityAvailable} {product?.unit || "kg"}</div>
            <div className="rounded-2xl bg-slate-50 p-4">Location: {product?.location || "Kigali"}</div>
            <div className="rounded-2xl bg-slate-50 p-4">Quality: {product?.qualityStatus || "Standard"}</div>
            <div className="rounded-2xl bg-slate-50 p-4">Farmer: {product?.farmer?.fullName || "Farmer"}</div>
          </div>

          {message ? <div className="mt-6 rounded-xl bg-green-50 px-4 py-3 text-green-700">{message}</div> : null}
          {error ? <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-red-700">{error}</div> : null}

          <OrderRequestForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
