import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyBookings } from "../../services/bookingService";
import { getProduceCategories } from "../../services/facilityService";
import { createListing, uploadListingImage } from "../../services/marketplaceService";
import { getUser } from "../../utilis/auth";

const MAX_LISTING_IMAGE_SIZE_MB = 10;

const initialForm = {
  bookingId: "",
  produceCategoryId: "",
  name: "",
  description: "",
  quantityAvailable: "",
  unit: "kg",
  price: "",
  qualityStatus: "",
  harvestDate: "",
  listingExpiryDate: "",
};

export default function CreateListingPage() {
  const navigate = useNavigate();
  const user = getUser();
  const [form, setForm] = useState(initialForm);
  const [bookings, setBookings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getMyBookings(), getProduceCategories()])
      .then(([bookingData, categoryData]) => {
        setBookings((bookingData || []).filter((booking) => booking.status === "IN_STORAGE" || booking.status === "COMPLETED" || booking.status === "APPROVED" || booking.status === "DELIVERED"));
        setCategories(categoryData?.data || []);
      })
      .catch((err) => setError(err?.response?.data?.message || err?.message || "Failed to load listing options"));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    if (imageFile && imageFile.size > MAX_LISTING_IMAGE_SIZE_MB * 1024 * 1024) {
      setError(`Listing image must be ${MAX_LISTING_IMAGE_SIZE_MB}MB or smaller.`);
      setSubmitting(false);
      return;
    }

    try {
      const listing = await createListing({
        farmerId: user?.id,
        bookingId: Number(form.bookingId),
        produceCategoryId: Number(form.produceCategoryId),
        name: form.name,
        description: form.description || null,
        quantityAvailable: Number(form.quantityAvailable),
        unit: form.unit,
        price: Number(form.price),
        qualityStatus: form.qualityStatus || null,
        harvestDate: form.harvestDate || null,
        listingExpiryDate: form.listingExpiryDate || null,
      });

      if (imageFile) {
        await uploadListingImage({
          listingId: listing.id,
          file: imageFile,
        });
      }

      navigate("/farmer/listings");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to create listing");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
   

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <select
          name="bookingId"
          value={form.bookingId}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-4 py-3"
          required
        >
          <option value="">Select Booking</option>
          {bookings.map((booking) => (
            <option key={booking.id} value={booking.id}>
              Booking #{booking.id} - {booking.facility?.name} - {booking.quantity}
            </option>
          ))}
        </select>
        <select
          name="produceCategoryId"
          value={form.produceCategoryId}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-4 py-3"
          required
        >
          <option value="">Select Produce Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
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
        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Product Photo</span>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setImageFile(event.target.files?.[0] || null)}
            className="rounded-xl border border-slate-300 px-4 py-3"
          />
          <span className="text-xs text-slate-500">
            Maximum image size: {MAX_LISTING_IMAGE_SIZE_MB}MB.
          </span>
        </label>
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

        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="cursor-pointer rounded-xl bg-[#47A369] px-4 py-3 font-semibold text-white transition hover:bg-[#3b8a58] hover:shadow-md md:col-span-2 disabled:opacity-60"
        >
          {submitting ? "Creating Listing..." : "Create Listing"}
        </button>
      </form>
    </div>
  );
}
