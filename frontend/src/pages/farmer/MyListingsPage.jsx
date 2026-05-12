import { useEffect, useState } from "react";
import FarmerListingCard from "../../components/marketplace/FarmerListingCard";
import { deleteListing, getMyListings } from "../../services/marketplaceService";

export default function MyListingsPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadItems = () =>
    getMyListings()
      .then((res) => setItems(res.data || res))
      .catch((err) => setError(err?.response?.data?.message || err?.message || "Failed to load listings"));

  useEffect(() => {
    loadItems();
  }, []);

  const handleDelete = async (listingId) => {
    setDeletingId(listingId);
    setError("");

    try {
      await deleteListing(listingId);
      await loadItems();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to delete listing");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((p) => (
          <FarmerListingCard
            key={p.id}
            product={p}
            onDelete={handleDelete}
            deleting={deletingId === p.id}
          />
        ))}
      </div>
    </div>
  );
}
