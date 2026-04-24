import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../../services/bookingService";
import { getColdRooms, getFacilities, getProduceCategories } from "../../services/facilityService";
import { createTransportRequest } from "../../services/transportService";
import { getUsers } from "../../services/userService";
import { getUser } from "../../utilis/auth";

const initialForm = {
  facilityId: "",
  coldRoomId: "",
  produceCategoryId: "",
  quantity: "",
  entryDate: "",
  expectedDurationDays: "",
  pickupLocation: "",
  destinationLocation: "",
  preferredPickupDate: "",
  notes: "",
};

export default function FarmerCreateBookingPage() {
  const navigate = useNavigate();
  const user = getUser();
  const [form, setForm] = useState(initialForm);
  const [facilities, setFacilities] = useState([]);
  const [coldRooms, setColdRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [approvedStorageManagerIds, setApprovedStorageManagerIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    Promise.all([
      getFacilities(),
      getColdRooms(),
      getProduceCategories(),
      getUsers({ role: "STORAGE_MANAGER", status: "ACTIVE" }),
    ])
      .then(([facilityData, coldRoomData, categoryData, activeManagers]) => {
        const managerIds = (activeManagers || []).map((manager) => manager.id);
        setApprovedStorageManagerIds(managerIds);
        setFacilities(
          (facilityData || []).filter(
            (facility) => facility.active && managerIds.includes(facility.manager?.id)
          )
        );
        setColdRooms(
          (coldRoomData || []).filter(
            (room) => room.active && managerIds.includes(room.facility?.manager?.id)
          )
        );
        setCategories((categoryData?.data || []).filter((category) => category.active));
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err?.message || "Failed to load booking options");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const selectedRoom = useMemo(
    () => coldRooms.find((room) => String(room.id) === form.coldRoomId),
    [coldRooms, form.coldRoomId]
  );

  const selectedFacility = useMemo(
    () => facilities.find((facility) => String(facility.id) === form.facilityId),
    [facilities, form.facilityId]
  );

  const facilityRooms = useMemo(
    () => coldRooms.filter((room) => String(room.facility?.id) === form.facilityId),
    [coldRooms, form.facilityId]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => {
      if (name === "facilityId") {
        const facility = facilities.find((item) => String(item.id) === value);
        const destinationLocation = facility
          ? [facility.name, facility.address, facility.district].filter(Boolean).join(", ")
          : "";

        return { ...current, facilityId: value, coldRoomId: "", destinationLocation };
      }

      return { ...current, [name]: value };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    if (!user?.id) {
      setError("Farmer account not found. Please log in again.");
      setSubmitting(false);
      return;
    }

    if (!form.facilityId || !form.coldRoomId || !form.produceCategoryId) {
      setError("Please select the facility, cold room, and produce type.");
      setSubmitting(false);
      return;
    }

    if (selectedRoom && Number(form.quantity) > Number(selectedRoom.availableCapacity)) {
      setError(`Selected room only has ${selectedRoom.availableCapacity} available capacity.`);
      setSubmitting(false);
      return;
    }

    try {
      const bookingPayload = {
        farmerId: user.id,
        facilityId: Number(form.facilityId),
        coldRoomId: Number(form.coldRoomId),
        produceCategoryId: Number(form.produceCategoryId),
        quantity: Number(form.quantity),
        entryDate: form.entryDate,
        expectedDurationDays: Number(form.expectedDurationDays),
      };

      const booking = await createBooking(bookingPayload);

      await createTransportRequest({
        bookingId: booking.id,
        farmerId: user.id,
        pickupLocation: form.pickupLocation,
        destinationLocation: form.destinationLocation,
        quantityToTransport: Number(form.quantity),
        preferredPickupDate: form.preferredPickupDate || form.entryDate,
        notes: form.notes,
      });

      setSuccess("Booking and transport request created successfully.");
      setForm(initialForm);
      navigate("/farmer/bookings");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (!loading && approvedStorageManagerIds.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Booking Management</h2>
        <p className="mt-3 text-slate-500">
          No approved storage owners are available yet. Farmers will only see storage facilities after the storage owner account is approved by admin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Booking Management</h2>
        <p className="mt-2 text-slate-500">
          Book storage space and immediately create the transport request for the same product.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-slate-900">Storage Booking</h3>
            <p className="mt-1 text-sm text-slate-500">
              Select the facility, room, produce type, quantity, entry date, and expected storage duration.
            </p>
          </div>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Facility
            <select
              name="facilityId"
              value={form.facilityId}
              onChange={handleChange}
              className="rounded-xl border border-slate-300 px-4 py-3 font-normal"
              disabled={loading}
              required
            >
              <option value="">Select facility</option>
              {facilities.map((facility) => (
                <option key={facility.id} value={facility.id}>
                  {facility.name} - {facility.district}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Room
            <select
              name="coldRoomId"
              value={form.coldRoomId}
              onChange={handleChange}
              className="rounded-xl border border-slate-300 px-4 py-3 font-normal"
              disabled={loading || !form.facilityId}
              required
            >
              <option value="">Select cold room</option>
              {facilityRooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} ({room.code}) - {room.availableCapacity} available
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Produce Type
            <select
              name="produceCategoryId"
              value={form.produceCategoryId}
              onChange={handleChange}
              className="rounded-xl border border-slate-300 px-4 py-3 font-normal"
              disabled={loading}
              required
            >
              <option value="">Select produce type</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Quantity
            <input
              name="quantity"
              type="number"
              min="0.01"
              step="0.01"
              value={form.quantity}
              onChange={handleChange}
              className="rounded-xl border border-slate-300 px-4 py-3 font-normal"
              placeholder="Enter quantity"
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Entry Date
            <input
              name="entryDate"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={form.entryDate}
              onChange={handleChange}
              className="rounded-xl border border-slate-300 px-4 py-3 font-normal"
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Expected Storage Duration (Days)
            <input
              name="expectedDurationDays"
              type="number"
              min="1"
              value={form.expectedDurationDays}
              onChange={handleChange}
              className="rounded-xl border border-slate-300 px-4 py-3 font-normal"
              placeholder="Number of days"
              required
            />
          </label>

          {selectedRoom && (
            <div className="rounded-xl border border-[#47A369]/20 bg-[#47A369]/5 p-4 text-sm text-slate-700 md:col-span-2">
              Selected room: {selectedRoom.name} ({selectedRoom.code}) with {selectedRoom.availableCapacity} available capacity at {selectedRoom.pricePerUnit} per unit.
            </div>
          )}

          {selectedFacility && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 md:col-span-2">
              Destination facility: {selectedFacility.name}
              {selectedFacility.address ? `, ${selectedFacility.address}` : ""}
              {selectedFacility.district ? `, ${selectedFacility.district}` : ""}
            </div>
          )}

          <div className="border-t border-slate-200 pt-2 md:col-span-2" />

          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-slate-900">Required Transport Booking</h3>
            <p className="mt-1 text-sm text-slate-500">
              Every farmer booking must also include a transport request for the same product quantity.
            </p>
          </div>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 md:col-span-2">
            Pickup Location
            <input
              name="pickupLocation"
              value={form.pickupLocation}
              onChange={handleChange}
              className="rounded-xl border border-slate-300 px-4 py-3 font-normal"
              placeholder="Farm or pickup address"
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 md:col-span-2">
            Destination Location
            <input
              name="destinationLocation"
              value={form.destinationLocation}
              onChange={handleChange}
              className="rounded-xl border border-slate-300 px-4 py-3 font-normal"
              placeholder="Storage facility destination"
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Preferred Pickup Date
            <input
              name="preferredPickupDate"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={form.preferredPickupDate}
              onChange={handleChange}
              className="rounded-xl border border-slate-300 px-4 py-3 font-normal"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Notes
            <input
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="rounded-xl border border-slate-300 px-4 py-3 font-normal"
              placeholder="Special handling notes"
            />
          </label>
        </div>

        {error && (
          <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Submitting this form creates both the storage booking and its transport request.
          </p>
          <button
            type="submit"
            disabled={loading || submitting}
            className="rounded-xl bg-[#47A369] px-5 py-3 font-semibold text-white disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Create Booking"}
          </button>
        </div>
      </form>
    </div>
  );
}
