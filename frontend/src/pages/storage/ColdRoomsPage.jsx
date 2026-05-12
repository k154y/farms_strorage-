import { useEffect, useMemo, useState } from "react";
import ColdRoomCard from "../../components/storage/ColdRoomCard";
import {
  createColdRoom,
  createProduceCategory,
  getColdRooms,
  getFacilities,
  getProduceCategories,
} from "../../services/facilityService";
import { getUser } from "../../utilis/auth";

const initialForm = {
  facilityId: "",
  code: "",
  name: "",
  totalCapacity: "",
  availableCapacity: "",
  minTemperature: "",
  maxTemperature: "",
  pricingType: "PER_DAY",
  pricePerUnit: "",
  supportedCategoryIds: [],
};

export default function ColdRoomsPage() {
  const [items, setItems] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const user = getUser();

  const loadData = () => {
    Promise.all([getColdRooms(), getFacilities(), getProduceCategories()])
      .then(([coldRoomsRes, facilitiesRes, categoryRes]) => {
        const coldRooms = coldRoomsRes.data || coldRoomsRes || [];
        const managerFacilities = (facilitiesRes.data || facilitiesRes || []).filter(
          (facility) => facility.manager?.id === user?.id
        );
        const activeCategories = (categoryRes?.data || categoryRes || []).filter((category) => category.active);

        setFacilities(managerFacilities);
        setCategories(activeCategories);
        setItems(
          coldRooms.filter((room) =>
            managerFacilities.some((facility) => facility.id === room.facility?.id)
          )
        );
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const selectedCategoryLabels = useMemo(
    () =>
      categories
        .filter((category) => form.supportedCategoryIds.includes(String(category.id)))
        .map((category) => category.name),
    [categories, form.supportedCategoryIds]
  );

  const toggleCategory = (categoryId) => {
    setForm((current) => {
      const id = String(categoryId);
      const alreadySelected = current.supportedCategoryIds.includes(id);

      return {
        ...current,
        supportedCategoryIds: alreadySelected
          ? current.supportedCategoryIds.filter((value) => value !== id)
          : [...current.supportedCategoryIds, id],
      };
    });
  };

  const handleCreateCategory = async () => {
    const cleanedName = newCategoryName.trim();

    if (!cleanedName) {
      setError("Enter a produce type name first.");
      return;
    }

    const existingCategory = categories.find(
      (category) => category.name?.trim().toLowerCase() === cleanedName.toLowerCase()
    );

    if (existingCategory) {
      setForm((current) => ({
        ...current,
        supportedCategoryIds: current.supportedCategoryIds.includes(String(existingCategory.id))
          ? current.supportedCategoryIds
          : [...current.supportedCategoryIds, String(existingCategory.id)],
      }));
      setNewCategoryName("");
      setError("");
      return;
    }

    setCreatingCategory(true);
    setError("");

    try {
      const response = await createProduceCategory({
        name: cleanedName,
        description: `Created while assigning produce types to a cold room`,
        active: true,
      });
      const createdCategory = response?.data || response;

      if (createdCategory) {
        setCategories((current) =>
          [...current, createdCategory].sort((left, right) => left.name.localeCompare(right.name))
        );
        setForm((current) => ({
          ...current,
          supportedCategoryIds: [...current.supportedCategoryIds, String(createdCategory.id)],
        }));
      }

      setNewCategoryName("");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to create produce type");
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    if (form.supportedCategoryIds.length === 0) {
      setError("Please choose at least one produce type for this cold room.");
      setSubmitting(false);
      return;
    }

    try {
      await createColdRoom({
        facilityId: Number(form.facilityId),
        code: form.code,
        name: form.name,
        totalCapacity: Number(form.totalCapacity),
        availableCapacity: Number(form.availableCapacity),
        minTemperature: form.minTemperature ? Number(form.minTemperature) : null,
        maxTemperature: form.maxTemperature ? Number(form.maxTemperature) : null,
        pricingType: form.pricingType,
        pricePerUnit: Number(form.pricePerUnit),
        active: true,
        supportedCategoryIds: form.supportedCategoryIds.map(Number),
      });
      setForm(initialForm);
      loadData();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to create cold room");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-sm">
     
        <p className="mt-2 text-slate-500">Every cold room must be registered under one of your facilities.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <select
            value={form.facilityId}
            onChange={(e) => setForm((current) => ({ ...current, facilityId: e.target.value }))}
            className="rounded-xl border border-slate-300 px-4 py-3"
            required
          >
            <option value="">Select Facility</option>
            {facilities.map((facility) => (
              <option key={facility.id} value={facility.id}>
                {facility.name}
              </option>
            ))}
          </select>
          <input value={form.code} onChange={(e) => setForm((c) => ({ ...c, code: e.target.value }))} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Room Code" required />
          <input value={form.name} onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Room Name" required />
          <input type="number" step="0.01" value={form.totalCapacity} onChange={(e) => setForm((c) => ({ ...c, totalCapacity: e.target.value }))} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Total Capacity" required />
          <input type="number" step="0.01" value={form.availableCapacity} onChange={(e) => setForm((c) => ({ ...c, availableCapacity: e.target.value }))} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Available Capacity" required />
          <select value={form.pricingType} onChange={(e) => setForm((c) => ({ ...c, pricingType: e.target.value }))} className="rounded-xl border border-slate-300 px-4 py-3" required>
            {["PER_DAY", "PER_WEEK", "PER_MONTH", "PER_KG", "PER_TON"].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <input type="number" step="0.01" value={form.pricePerUnit} onChange={(e) => setForm((c) => ({ ...c, pricePerUnit: e.target.value }))} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Price Per Unit" required />
          <input type="number" step="0.01" value={form.minTemperature} onChange={(e) => setForm((c) => ({ ...c, minTemperature: e.target.value }))} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Min Temperature" />
          <input type="number" step="0.01" value={form.maxTemperature} onChange={(e) => setForm((c) => ({ ...c, maxTemperature: e.target.value }))} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Max Temperature" />
        </div>
        <div className="mt-6">
          <p className="text-sm font-medium text-slate-700">Supported Produce Types</p>
          <p className="mt-1 text-sm text-slate-500">Choose the produce types this room can safely receive for booking.</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm"
              placeholder="Add new produce type, for example Beans"
            />
            <button
              type="button"
              onClick={handleCreateCategory}
              disabled={creatingCategory}
              className="rounded-xl border border-[#47A369] px-4 py-3 text-sm font-semibold text-[#2f6f48] disabled:opacity-60"
            >
              {creatingCategory ? "Adding..." : "Add Produce Type"}
            </button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => {
              const checked = form.supportedCategoryIds.includes(String(category.id));

              return (
                <label
                  key={category.id}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                    checked ? "border-[#47A369] bg-[#47A369]/10 text-[#2f6f48]" : "border-slate-200 text-slate-600"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCategory(category.id)}
                    className="h-4 w-4"
                  />
                  <span>{category.name}</span>
                </label>
              );
            })}
          </div>
          {selectedCategoryLabels.length > 0 && (
            <p className="mt-3 text-sm text-slate-600">
              Selected: {selectedCategoryLabels.join(", ")}
            </p>
          )}
          {selectedCategoryLabels.length === 0 && (
            <p className="mt-3 text-sm text-amber-700">
              Select at least one produce type so farmers only book rooms that can receive their produce.
            </p>
          )}
        </div>
        {error && <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        <button type="submit" disabled={submitting} className="mt-6 rounded-xl bg-[#47A369] px-5 py-3 font-semibold text-white disabled:opacity-60">
          {submitting ? "Registering..." : "Register Cold Room"}
        </button>
      </form>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{items.map((r) => <ColdRoomCard key={r.id} room={r} />)}</div>
    </div>
  );
}
