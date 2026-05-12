import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { createBooking } from "../../services/bookingService";
import { getFarmerProfile } from "../../services/farmerProfileService";
import { getColdRooms, getFacilities, getProduceCategories } from "../../services/facilityService";
import { createTransportRequest } from "../../services/transportService";
import { getUsers } from "../../services/userService";
import { getUser } from "../../utilis/auth";

const BOOKING_MODES = {
  STORAGE_ONLY: "STORAGE_ONLY",
  TRANSPORT_ONLY: "TRANSPORT_ONLY",
  STORAGE_AND_TRANSPORT: "STORAGE_AND_TRANSPORT",
};

const initialForm = {
  bookingMode: BOOKING_MODES.STORAGE_AND_TRANSPORT,
  facilityId: "",
  coldRoomId: "",
  produceCategoryId: "",
  quantity: "",
  entryDate: "",
  expectedDurationDays: "",
  farmLocationId: "",
  pickupLocation: "",
  destinationLocation: "",
  preferredPickupDate: "",
  notes: "",
  districtFilter: "",
  facilitySearch: "",
  maxPriceFilter: "",
  minCapacityFilter: "",
};

const today = new Date().toISOString().split("T")[0];

const toRadians = (value) => (value * Math.PI) / 180;

const getDistanceKm = (from, to) => {
  if (
    from?.latitude == null ||
    from?.longitude == null ||
    to?.latitude == null ||
    to?.longitude == null
  ) {
    return null;
  }

  const earthRadiusKm = 6371;
  const deltaLat = toRadians(to.latitude - from.latitude);
  const deltaLon = toRadians(to.longitude - from.longitude);
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;

  return earthRadiusKm * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const formatDistance = (distanceKm) =>
  distanceKm == null ? "Distance unavailable" : `${distanceKm.toFixed(1)} km away`;

const formatLocationLabel = (location) =>
  [location?.district, location?.sector, location?.village].filter(Boolean).join(", ");

export default function FarmerCreateBookingPage() {
  const [searchParams] = useSearchParams();
  const user = getUser();
  const [form, setForm] = useState(initialForm);
  const [facilities, setFacilities] = useState([]);
  const [coldRooms, setColdRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [farmLocations, setFarmLocations] = useState([]);
  const [approvedStorageManagerIds, setApprovedStorageManagerIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const requestedFacilityId = searchParams.get("facilityId");

  useEffect(() => {
    Promise.all([
      getFacilities(),
      getColdRooms(),
      getProduceCategories(),
      getUsers({ role: "STORAGE_MANAGER", status: "ACTIVE" }),
      getFarmerProfile().catch(() => null),
    ])
      .then(([facilityData, coldRoomData, categoryData, activeManagers, farmerProfile]) => {
        const managerIds = (activeManagers || []).map((manager) => manager.id);
        const visibleFacilities = (facilityData || []).filter(
          (facility) => facility.active && managerIds.includes(facility.manager?.id)
        );
        const visibleRooms = (coldRoomData || []).filter(
          (room) => room.active && managerIds.includes(room.facility?.manager?.id)
        );

        setApprovedStorageManagerIds(managerIds);
        setFacilities(visibleFacilities);
        setColdRooms(visibleRooms);
        setCategories((categoryData?.data || categoryData || []).filter((category) => category.active));
        setFarmLocations(farmerProfile?.locations || []);
        if (requestedFacilityId && visibleFacilities.some((facility) => String(facility.id) === requestedFacilityId)) {
          const matchedFacility = visibleFacilities.find(
            (facility) => String(facility.id) === requestedFacilityId
          );
          setForm((current) => ({
            ...current,
            facilityId: requestedFacilityId,
            districtFilter: matchedFacility?.district || current.districtFilter,
            destinationLocation: matchedFacility
              ? [matchedFacility.name, matchedFacility.address, matchedFacility.district].filter(Boolean).join(", ")
              : current.destinationLocation,
          }));
        }
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err?.message || "Failed to load booking options");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [requestedFacilityId]);

  const needsStorage = form.bookingMode !== BOOKING_MODES.TRANSPORT_ONLY;
  const needsTransport = form.bookingMode !== BOOKING_MODES.STORAGE_ONLY;

  const selectedCategory = useMemo(
    () => categories.find((category) => String(category.id) === form.produceCategoryId),
    [categories, form.produceCategoryId]
  );

  const selectedFacility = useMemo(
    () => facilities.find((facility) => String(facility.id) === form.facilityId),
    [facilities, form.facilityId]
  );

  const selectedRoom = useMemo(
    () => coldRooms.find((room) => String(room.id) === form.coldRoomId),
    [coldRooms, form.coldRoomId]
  );

  const selectedFacilitySupportedCategories = useMemo(() => {
    if (!form.facilityId) {
      return categories;
    }

    const categoryMap = new Map();

    coldRooms
      .filter((room) => String(room.facility?.id) === form.facilityId)
      .forEach((room) => {
        (room.supportedCategories || []).forEach((category) => {
          if (category?.active !== false) {
            categoryMap.set(String(category.id), category);
          }
        });
      });

    return Array.from(categoryMap.values()).sort((left, right) => left.name.localeCompare(right.name));
  }, [categories, coldRooms, form.facilityId]);

  const selectedFarmLocation = useMemo(() => {
    if (!farmLocations.length) {
      return null;
    }

    return (
      farmLocations.find((location) => String(location.id) === form.farmLocationId) || farmLocations[0]
    );
  }, [farmLocations, form.farmLocationId]);

  const facilityInsights = useMemo(
    () =>
      facilities.map((facility) => {
        const facilityRooms = coldRooms
          .filter((room) => room.facility?.id === facility.id)
          .filter((room) =>
            !form.produceCategoryId ||
            (room.supportedCategories || []).some(
              (category) => String(category.id) === form.produceCategoryId
            )
          );
        const bestPrice = facilityRooms.length
          ? Math.min(...facilityRooms.map((room) => Number(room.pricePerUnit) || 0))
          : null;
        const bestCapacity = facilityRooms.length
          ? Math.max(...facilityRooms.map((room) => Number(room.availableCapacity) || 0))
          : 0;
        const distanceKm = getDistanceKm(selectedFarmLocation, facility);
        const sameDistrict =
          selectedFarmLocation?.district &&
          facility.district &&
          selectedFarmLocation.district.trim().toLowerCase() === facility.district.trim().toLowerCase();
        const score =
          (sameDistrict ? 50 : 0) +
          Math.min(bestCapacity || 0, 1000) / 20 -
          (bestPrice || 0) / 5 -
          (distanceKm || 0);

        return {
          ...facility,
          rooms: facilityRooms,
          bestPrice,
          bestCapacity,
          distanceKm,
          sameDistrict,
          score,
        };
      }),
    [coldRooms, facilities, form.produceCategoryId, selectedFarmLocation]
  );

  const suggestedFacilities = useMemo(() => {
    return facilityInsights
      .filter((facility) => {
        if (facility.rooms.length === 0) {
          return false;
        }

        const districtMatch =
          !form.districtFilter ||
          facility.district?.toLowerCase().includes(form.districtFilter.trim().toLowerCase());
        const nameMatch =
          !form.facilitySearch ||
          facility.name?.toLowerCase().includes(form.facilitySearch.trim().toLowerCase());
        const priceMatch =
          !form.maxPriceFilter ||
          (facility.bestPrice != null && facility.bestPrice <= Number(form.maxPriceFilter));
        const capacityMatch =
          !form.minCapacityFilter || facility.bestCapacity >= Number(form.minCapacityFilter);

        return districtMatch && nameMatch && priceMatch && capacityMatch;
      })
      .sort((left, right) => right.score - left.score);
  }, [facilityInsights, form.districtFilter, form.facilitySearch, form.maxPriceFilter, form.minCapacityFilter]);

  const facilityRooms = useMemo(() => {
    if (!form.facilityId) {
      return [];
    }

    const quantity = Number(form.quantity) || 0;

    return coldRooms
      .filter((room) => String(room.facility?.id) === form.facilityId)
      .filter((room) =>
        !form.produceCategoryId ||
        (room.supportedCategories || []).some(
          (category) => String(category.id) === form.produceCategoryId
        )
      )
      .filter((room) => !quantity || Number(room.availableCapacity) >= quantity)
      .sort((left, right) => Number(left.pricePerUnit) - Number(right.pricePerUnit));
  }, [coldRooms, form.facilityId, form.produceCategoryId, form.quantity]);

  useEffect(() => {
    if (
      form.produceCategoryId &&
      !selectedFacilitySupportedCategories.some(
        (category) => String(category.id) === form.produceCategoryId
      )
    ) {
      setForm((current) => ({
        ...current,
        produceCategoryId: "",
        coldRoomId: "",
      }));
    }
  }, [form.produceCategoryId, selectedFacilitySupportedCategories]);

  useEffect(() => {
    if (!needsTransport) {
      return;
    }

    if (selectedFarmLocation && !form.pickupLocation) {
      setForm((current) => ({
        ...current,
        farmLocationId: current.farmLocationId || String(selectedFarmLocation.id),
        pickupLocation:
          current.pickupLocation ||
          [selectedFarmLocation.farmLocationDescription, formatLocationLabel(selectedFarmLocation)]
            .filter(Boolean)
            .join(", "),
      }));
    }
  }, [form.pickupLocation, needsTransport, selectedFarmLocation]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => {
      if (name === "bookingMode") {
        return {
          ...current,
          bookingMode: value,
          facilityId: value === BOOKING_MODES.TRANSPORT_ONLY ? "" : current.facilityId,
          coldRoomId: value === BOOKING_MODES.TRANSPORT_ONLY ? "" : current.coldRoomId,
          destinationLocation:
            value === BOOKING_MODES.TRANSPORT_ONLY
              ? current.destinationLocation
              : current.destinationLocation || current.pickupLocation,
        };
      }

      if (name === "facilityId") {
        const facility = facilities.find((item) => String(item.id) === value);
        const destinationLocation = facility
          ? [facility.name, facility.address, facility.district].filter(Boolean).join(", ")
          : "";

        const supportedCategories = new Set(
          coldRooms
            .filter((room) => String(room.facility?.id) === value)
            .flatMap((room) => room.supportedCategories || [])
            .map((category) => String(category.id))
        );
        const keepCurrentCategory =
          !current.produceCategoryId || supportedCategories.has(current.produceCategoryId);

        return {
          ...current,
          facilityId: value,
          coldRoomId: "",
          produceCategoryId: keepCurrentCategory ? current.produceCategoryId : "",
          destinationLocation,
        };
      }

      if (name === "farmLocationId") {
        const farmLocation = farmLocations.find((item) => String(item.id) === value);
        return {
          ...current,
          farmLocationId: value,
          districtFilter: farmLocation?.district || current.districtFilter,
          pickupLocation: farmLocation
            ? [farmLocation.farmLocationDescription, formatLocationLabel(farmLocation)]
                .filter(Boolean)
                .join(", ")
            : current.pickupLocation,
        };
      }

      return { ...current, [name]: value };
    });
  };

  const validateForm = () => {
    if (!user?.id) {
      return "Farmer account not found. Please log in again.";
    }

    if (!form.produceCategoryId) {
      return "Please choose the produce type first.";
    }

    if (!form.quantity || Number(form.quantity) <= 0) {
      return "Please enter a valid quantity.";
    }

    if (needsStorage) {
      if (!form.facilityId || !form.coldRoomId || !form.entryDate || !form.expectedDurationDays) {
        return "Please complete the storage booking details.";
      }

      if (selectedRoom && Number(form.quantity) > Number(selectedRoom.availableCapacity)) {
        return `Selected room only has ${selectedRoom.availableCapacity} available capacity.`;
      }
    }

    if (needsTransport) {
      if (!form.pickupLocation || !form.destinationLocation) {
        return "Please enter both pickup and delivery locations for transport.";
      }
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    const validationMessage = validateForm();
    if (validationMessage) {
      setError(validationMessage);
      setSubmitting(false);
      return;
    }

    let createdBooking = null;
    let createdTransport = null;

    try {
      if (needsStorage) {
        createdBooking = await createBooking({
          farmerId: user.id,
          facilityId: Number(form.facilityId),
          coldRoomId: Number(form.coldRoomId),
          produceCategoryId: Number(form.produceCategoryId),
          quantity: Number(form.quantity),
          entryDate: form.entryDate,
          expectedDurationDays: Number(form.expectedDurationDays),
        });
      }

      if (needsTransport) {
        createdTransport = await createTransportRequest({
          bookingId: createdBooking?.id ?? null,
          farmerId: user.id,
          pickupLocation: form.pickupLocation,
          destinationLocation: form.destinationLocation,
          quantityToTransport: Number(form.quantity),
          preferredPickupDate: form.preferredPickupDate || form.entryDate || null,
          notes: form.notes,
        });
      }

      const parts = [];
      if (createdBooking) {
        parts.push(`storage booking #${createdBooking.id}`);
      }
      if (createdTransport) {
        parts.push(`transport request #${createdTransport.id}`);
      }

      setSuccess(`Created ${parts.join(" and ")} successfully.`);
      setForm({
        ...initialForm,
        bookingMode: form.bookingMode,
        produceCategoryId: form.produceCategoryId,
        farmLocationId: form.farmLocationId,
        districtFilter: form.districtFilter,
      });
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Submission failed";
      if (createdBooking && needsTransport && !createdTransport) {
        setError(`Storage booking #${createdBooking.id} was created, but transport failed: ${message}`);
      } else {
        setError(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!loading && approvedStorageManagerIds.length === 0 && needsStorage) {
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
          Farmers can now book storage only, request transport only, or submit both together in one flow.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Choose Service</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              [BOOKING_MODES.STORAGE_AND_TRANSPORT, "Storage + transport"],
              [BOOKING_MODES.STORAGE_ONLY, "Storage only"],
              [BOOKING_MODES.TRANSPORT_ONLY, "Transport only"],
            ].map(([value, label]) => (
              <label
                key={value}
                className={`rounded-2xl border p-4 text-sm font-medium transition ${
                  form.bookingMode === value
                    ? "border-[#47A369] bg-[#47A369]/10 text-[#2f6f48]"
                    : "border-slate-200 text-slate-600"
                }`}
              >
                <input
                  type="radio"
                  name="bookingMode"
                  value={value}
                  checked={form.bookingMode === value}
                  onChange={handleChange}
                  className="sr-only"
                />
                {label}
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="grid gap-6 md:grid-cols-2">
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
                {selectedFacilitySupportedCategories.map((category) => (
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

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 md:col-span-2">
              Farm / Pickup Source
              <select
                name="farmLocationId"
                value={form.farmLocationId}
                onChange={handleChange}
                className="rounded-xl border border-slate-300 px-4 py-3 font-normal"
              >
                <option value="">Use my default farm location</option>
                {farmLocations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {formatLocationLabel(location) || location.farmLocationDescription || `Location ${location.id}`}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {selectedCategory && (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-slate-700">
              {selectedCategory.name} stores best between{" "}
              {selectedCategory.recommendedMinTemperature ?? "N/A"} and{" "}
              {selectedCategory.recommendedMaxTemperature ?? "N/A"} degrees Celsius.
            </div>
          )}
        </section>

        {needsStorage && (
          <>
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Find a Facility</h3>
              <p className="mt-1 text-sm text-slate-500">
                Suggestions are ranked by district match, nearby location, price, and available capacity.
              </p>
              {requestedFacilityId && selectedFacility && (
                <div className="mt-4 rounded-xl border border-[#47A369]/20 bg-[#47A369]/5 p-4 text-sm text-slate-700">
                  You came from the public storage search page. Facility <span className="font-semibold">{selectedFacility.name}</span> has been preselected for faster booking.
                </div>
              )}

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  District
                  <input
                    name="districtFilter"
                    value={form.districtFilter}
                    onChange={handleChange}
                    className="rounded-xl border border-slate-300 px-4 py-3 font-normal"
                    placeholder="Filter by district"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  Facility
                  <input
                    name="facilitySearch"
                    value={form.facilitySearch}
                    onChange={handleChange}
                    className="rounded-xl border border-slate-300 px-4 py-3 font-normal"
                    placeholder="Search facility name"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  Max Price Per Unit
                  <input
                    name="maxPriceFilter"
                    type="number"
                    min="0"
                    value={form.maxPriceFilter}
                    onChange={handleChange}
                    className="rounded-xl border border-slate-300 px-4 py-3 font-normal"
                    placeholder="Any price"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  Min Available Capacity
                  <input
                    name="minCapacityFilter"
                    type="number"
                    min="0"
                    value={form.minCapacityFilter}
                    onChange={handleChange}
                    className="rounded-xl border border-slate-300 px-4 py-3 font-normal"
                    placeholder="Any capacity"
                  />
                </label>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {suggestedFacilities.slice(0, 6).map((facility) => (
                  <button
                    key={facility.id}
                    type="button"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        facilityId: String(facility.id),
                        coldRoomId: "",
                        destinationLocation: [facility.name, facility.address, facility.district]
                          .filter(Boolean)
                          .join(", "),
                      }))
                    }
                    className={`rounded-2xl border p-4 text-left transition ${
                      String(facility.id) === form.facilityId
                        ? "border-[#47A369] bg-[#47A369]/10"
                        : "border-slate-200 hover:border-[#47A369]/40"
                    }`}
                  >
                    <p className="text-base font-semibold text-slate-900">{facility.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {facility.district}
                      {facility.address ? `, ${facility.address}` : ""}
                    </p>
                    <div className="mt-4 space-y-1 text-sm text-slate-600">
                      <p>{facility.sameDistrict ? "Matches your district" : "Different district"}</p>
                      <p>{formatDistance(facility.distanceKm)}</p>
                      <p>Best price: {facility.bestPrice ?? "N/A"} per unit</p>
                      <p>Best room capacity: {facility.bestCapacity ?? 0}</p>
                    </div>
                  </button>
                ))}
              </div>

              {suggestedFacilities.length === 0 && (
                <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                  No facilities match the current search and filter values.
                </div>
              )}
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="grid gap-6 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  Facility
                  <select
                    name="facilityId"
                    value={form.facilityId}
                    onChange={handleChange}
                    className="rounded-xl border border-slate-300 px-4 py-3 font-normal"
                    disabled={loading}
                    required={needsStorage}
                  >
                    <option value="">Select facility</option>
                    {suggestedFacilities.map((facility) => (
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
                    required={needsStorage}
                  >
                    <option value="">Select cold room</option>
                    {facilityRooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name} ({room.code}) - {room.availableCapacity} available - {room.pricePerUnit}/unit
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  Entry Date
                  <input
                    name="entryDate"
                    type="date"
                    min={today}
                    value={form.entryDate}
                    onChange={handleChange}
                    className="rounded-xl border border-slate-300 px-4 py-3 font-normal"
                    required={needsStorage}
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
                    required={needsStorage}
                  />
                </label>
              </div>

              {selectedRoom && (
                <div className="mt-6 rounded-xl border border-[#47A369]/20 bg-[#47A369]/5 p-4 text-sm text-slate-700">
                  Selected room: {selectedRoom.name} ({selectedRoom.code}) with {selectedRoom.availableCapacity} available capacity at {selectedRoom.pricePerUnit} per unit. Supported produce types:{" "}
                  {selectedRoom.supportedCategories?.length
                    ? selectedRoom.supportedCategories.map((category) => category.name).join(", ")
                    : "none assigned"}
                </div>
              )}
            </section>
          </>
        )}

        {needsTransport && (
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Transport Request</h3>
            <p className="mt-1 text-sm text-slate-500">
              Track transport separately with pickup, delivery, quantity, and status updates.
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                Pickup Location
                <input
                  name="pickupLocation"
                  value={form.pickupLocation}
                  onChange={handleChange}
                  className="rounded-xl border border-slate-300 px-4 py-3 font-normal"
                  placeholder="Farm or pickup address"
                  required={needsTransport}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                Delivery Location
                <input
                  name="destinationLocation"
                  value={form.destinationLocation}
                  onChange={handleChange}
                  className="rounded-xl border border-slate-300 px-4 py-3 font-normal"
                  placeholder="Storage facility or delivery address"
                  required={needsTransport}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Preferred Pickup Date
                <input
                  name="preferredPickupDate"
                  type="date"
                  min={today}
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
          </section>
        )}

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Status Tracking</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            {[
              "Booking submitted",
              "Waiting approval",
              "Approved",
              "Produce delivered",
              "In storage",
              "Storage completed",
            ].map((step) => (
              <div key={step} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {step}
              </div>
            ))}
          </div>
        </section>

        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <div className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Booking statuses include pending, approved, rejected, completed, and cancelled. Transport requests are tracked separately.
          </p>
          <button
            type="submit"
            disabled={loading || submitting}
            className="rounded-xl bg-[#47A369] px-5 py-3 font-semibold text-white disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </form>
    </div>
  );
}
