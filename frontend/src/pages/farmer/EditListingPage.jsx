import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getListingById, updateListing } from "../../services/marketplaceService";

const initialForm = {
  name: "",
  description: "",
  quantityAvailable: "",
  unit: "kg",
  price: "",
  qualityStatus: "",
  harvestDate: "",
  listingExpiryDate: "",
  status: "ACTIVE",
};

export default function EditListingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getListingById(id)
      .then((listing) => {
        setForm({
          name: listing.name || "",
          description: listing.description || "",
          quantityAvailable: listing.quantityAvailable ?? "",
          unit: listing.unit || "kg",
          price: listing.price ?? "",
          qualityStatus: listing.qualityStatus || "",
          harvestDate: listing.harvestDate || "",
          listingExpiryDate: listing.listingExpiryDate || "",
          status: listing.status || "ACTIVE",
        });
      })
      .catch((err) => setError(err?.response?.data?.message || err?.message || "Failed to load listing"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await updateListing(id, {
        name: form.name,
        description: form.description || null,
        quantityAvailable: Number(form.quantityAvailable),
        unit: form.unit,
        price: Number(form.price),
        qualityStatus: form.qualityStatus || null,
        harvestDate: form.harvestDate || null,
        listingExpiryDate: form.listingExpiryDate || null,
        status: form.status,
      });
      navigate("/farmer/listings");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to update listing");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">Edit Listing</h2>
      <p className="mt-2 text-slate-500">
        Update your listing details while keeping the marketplace view unchanged for buyers and guests.
      </p>

      {loading ? (
        <p className="mt-6 text-slate-500">Loading listing...</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-3 md:col-span-2"
            placeholder="Product Name"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="min-h-28 rounded-xl border border-slate-300 px-4 py-3 md:col-span-2"
            placeholder="Product Description"
          />
          <input
            name="quantityAvailable"
            type="number"
            step="0.01"
            value={form.quantityAvailable}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Quantity Available"
            required
          />
          <input
            name="price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Price"
            required
          />
          <input
            name="unit"
            value={form.unit}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Unit"
            required
          />
          <input
            name="qualityStatus"
            value={form.qualityStatus}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Quality Status"
          />
          <input
            name="harvestDate"
            type="date"
            value={form.harvestDate}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-3"
          />
          <input
            name="listingExpiryDate"
            type="date"
            value={form.listingExpiryDate}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-3"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-3 md:col-span-2"
            required
          >
            {["ACTIVE", "RESERVED", "SOLD_OUT", "EXPIRED", "HIDDEN"].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2">
              {error}
            </div>
          )}

          <div className="flex gap-3 md:col-span-2">
            <button
              type="button"
              onClick={() => navigate("/farmer/listings")}
              className="flex-1 cursor-pointer rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 cursor-pointer rounded-xl bg-[#47A369] px-4 py-3 font-semibold text-white transition hover:bg-[#3b8a58] hover:shadow-md disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
