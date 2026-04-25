import { useEffect, useState } from "react";
import {
  addFarmLocation,
  deleteFarmLocation,
  getFarmerProfile,
  updateFarmerAccount,
} from "../../services/farmerProfileService";
import GoogleMapsLocationPicker from "../../components/storage/GoogleMapsLocationPicker";

export default function FarmerProfilePage() {
  const [profile, setProfile] = useState(null);
  const [accountForm, setAccountForm] = useState({
    fullName: "",
    phoneNumber: "",
  });
  const [locationForm, setLocationForm] = useState({
    district: "",
    sector: "",
    village: "",
    farmLocationDescription: "",
    address: "",
    latitude: "",
    longitude: "",
  });
  const [loading, setLoading] = useState(true);
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingLocation, setSavingLocation] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getFarmerProfile();
      setProfile(data);
      setAccountForm({
        fullName: data?.fullName || "",
        phoneNumber: data?.phoneNumber || "",
      });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load farmer profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleAccountSubmit = async (event) => {
    event.preventDefault();
    setSavingAccount(true);
    setError("");
    setMessage("");

    try {
      const updated = await updateFarmerAccount(accountForm);
      setProfile(updated);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: updated.userId,
          fullName: updated.fullName,
          email: updated.email,
          role: "FARMER",
          status: updated.status,
        }),
      );
      setMessage("Your account details were updated.");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to update account");
    } finally {
      setSavingAccount(false);
    }
  };

  const handleLocationSubmit = async (event) => {
    event.preventDefault();
    setSavingLocation(true);
    setError("");
    setMessage("");

    try {
      await addFarmLocation({
        district: locationForm.district.trim(),
        sector: locationForm.sector.trim(),
        village: locationForm.village.trim() || null,
        farmLocationDescription: locationForm.farmLocationDescription.trim() || null,
        latitude: locationForm.latitude === "" ? null : Number(locationForm.latitude),
        longitude: locationForm.longitude === "" ? null : Number(locationForm.longitude),
      });

      setLocationForm({
        district: "",
        sector: "",
        village: "",
        farmLocationDescription: "",
        address: "",
        latitude: "",
        longitude: "",
      });
      setMessage("Farm location added successfully.");
      await loadProfile();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to add farm location");
    } finally {
      setSavingLocation(false);
    }
  };

  const handleDeleteLocation = async (locationId) => {
    setDeletingId(locationId);
    setError("");
    setMessage("");

    try {
      await deleteFarmLocation(locationId);
      setProfile((current) => ({
        ...current,
        locations: (current?.locations || []).filter((location) => location.id !== locationId),
      }));
      setMessage("Farm location removed.");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to remove farm location");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="rounded-2xl bg-white p-6 shadow-sm text-slate-500">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Farmer Profile</h2>
        <p className="mt-2 text-slate-500">
          Keep your account details and farm locations up to date so storage booking and marketplace activity stay linked to the right farmer account.
        </p>
        <div className="mt-4 inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          Account Status: {profile?.status || "UNKNOWN"}
        </div>
      </div>

      {message && <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}
      {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleAccountSubmit} className="rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Account Details</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Full Name</span>
            <input
              type="text"
              value={accountForm.fullName}
              onChange={(event) => setAccountForm((current) => ({ ...current, fullName: event.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              required
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Phone Number</span>
            <input
              type="text"
              value={accountForm.phoneNumber}
              onChange={(event) => setAccountForm((current) => ({ ...current, phoneNumber: event.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              required
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Email Address</span>
            <input
              type="email"
              value={profile?.email || ""}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500"
              disabled
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={savingAccount}
          className="mt-6 rounded-xl bg-[#47A369] px-5 py-3 font-semibold text-white disabled:opacity-60"
        >
          {savingAccount ? "Saving..." : "Save Account Details"}
        </button>
      </form>

      <form onSubmit={handleLocationSubmit} className="rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Farm Locations</h3>
        <p className="mt-2 text-slate-500">
          Add the places where your produce is harvested or prepared for storage. Latitude and longitude are optional.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">District</span>
            <input
              type="text"
              value={locationForm.district}
              onChange={(event) => setLocationForm((current) => ({ ...current, district: event.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              required
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Sector</span>
            <input
              type="text"
              value={locationForm.sector}
              onChange={(event) => setLocationForm((current) => ({ ...current, sector: event.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              required
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Village</span>
            <input
              type="text"
              value={locationForm.village}
              onChange={(event) => setLocationForm((current) => ({ ...current, village: event.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Location Description</span>
            <input
              type="text"
              value={locationForm.farmLocationDescription}
              onChange={(event) =>
                setLocationForm((current) => ({ ...current, farmLocationDescription: event.target.value }))
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="Nearby landmark or delivery note"
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Address from Google Maps</span>
            <input
              type="text"
              value={locationForm.address}
              onChange={(event) => setLocationForm((current) => ({ ...current, address: event.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="Optional mapped address"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Latitude</span>
            <input
              type="number"
              step="any"
              value={locationForm.latitude}
              onChange={(event) => setLocationForm((current) => ({ ...current, latitude: event.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Longitude</span>
            <input
              type="number"
              step="any"
              value={locationForm.longitude}
              onChange={(event) => setLocationForm((current) => ({ ...current, longitude: event.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>
          <GoogleMapsLocationPicker form={locationForm} setForm={setLocationForm} />
        </div>

        <button
          type="submit"
          disabled={savingLocation}
          className="mt-6 rounded-xl bg-[#304F3A] px-5 py-3 font-semibold text-white disabled:opacity-60"
        >
          {savingLocation ? "Adding Location..." : "Add Farm Location"}
        </button>
      </form>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Saved Farm Locations</h3>
        <div className="mt-4 space-y-4">
          {(profile?.locations || []).length === 0 ? (
            <p className="text-slate-500">No farm locations added yet.</p>
          ) : (
            profile.locations.map((location) => (
              <div
                key={location.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 px-4 py-4 md:flex-row md:items-start md:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {location.district}, {location.sector}
                    {location.village ? `, ${location.village}` : ""}
                  </p>
                  {location.farmLocationDescription && (
                    <p className="mt-1 text-sm text-slate-600">{location.farmLocationDescription}</p>
                  )}
                  {(location.latitude !== null || location.longitude !== null) && (
                    <p className="mt-1 text-sm text-slate-500">
                      Coordinates: {location.latitude ?? "-"}, {location.longitude ?? "-"}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteLocation(location.id)}
                  disabled={deletingId === location.id}
                  className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 disabled:opacity-60"
                >
                  {deletingId === location.id ? "Removing..." : "Remove"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
