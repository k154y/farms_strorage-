import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getColdRooms, getFacilities, getFacilityPhotos } from "../../services/facilityService";
import { getUsers } from "../../services/userService";
import { hasGoogleMapsKey, loadGoogleMaps } from "../../utilis/googleMaps";
import { getUser, isAuthenticated } from "../../utilis/auth";

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function getDistanceKm(from, to) {
  const earthRadiusKm = 6371;
  const deltaLat = toRadians(to.lat - from.lat);
  const deltaLng = toRadians(to.lng - from.lng);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(from.lat)) *
      Math.cos(toRadians(to.lat)) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

export default function BookStoragePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const mapRef = useRef(null);
  const [facilities, setFacilities] = useState([]);
  const [coldRooms, setColdRooms] = useState([]);
  const [photosByFacility, setPhotosByFacility] = useState({});
  const [district, setDistrict] = useState("");
  const [sector, setSector] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [nearMeOnly, setNearMeOnly] = useState(false);
  const [radiusKm, setRadiusKm] = useState("25");
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("");
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [mapsError, setMapsError] = useState("");
  const isDashboardView = location.pathname.startsWith("/farmer/");

  useEffect(() => {
    Promise.all([getFacilities(), getColdRooms(), getUsers({ role: "STORAGE_MANAGER", status: "ACTIVE" })])
      .then(([facilityData, coldRoomData, activeManagers]) => {
        const managerIds = (activeManagers || []).map((manager) => manager.id);
        const visibleFacilities = (facilityData || []).filter(
          (facility) => facility.active && managerIds.includes(facility.manager?.id)
        );

        setFacilities(visibleFacilities);
        setColdRooms((coldRoomData || []).filter((room) => room.active));
        setSelectedFacilityId(visibleFacilities[0]?.id ?? null);

        visibleFacilities.forEach((facility) => {
          getFacilityPhotos(facility.id)
            .then((items) => {
              setPhotosByFacility((current) => ({
                ...current,
                [facility.id]: items?.[0]?.filePath || "",
              }));
            })
            .catch(() => {
              setPhotosByFacility((current) => ({
                ...current,
                [facility.id]: "",
              }));
            });
        });
      })
      .catch(console.error);
  }, []);

  const districtOptions = useMemo(
    () => [...new Set(facilities.map((facility) => facility.district).filter(Boolean))].sort(),
    [facilities]
  );

  const sectorOptions = useMemo(() => {
    const filtered = district
      ? facilities.filter((facility) => facility.district === district)
      : facilities;
    return [...new Set(filtered.map((facility) => facility.sector).filter(Boolean))].sort();
  }, [district, facilities]);

  const facilitiesWithDistance = useMemo(() => {
    return facilities.map((facility) => {
      const hasCoordinates = facility.latitude != null && facility.longitude != null;
      const distanceKm =
        userLocation && hasCoordinates
          ? getDistanceKm(userLocation, {
              lat: Number(facility.latitude),
              lng: Number(facility.longitude),
            })
          : null;

      const relatedRooms = coldRooms.filter((room) => room.facility?.id === facility.id);
      const minPrice = relatedRooms.length
        ? Math.min(...relatedRooms.map((room) => Number(room.pricePerUnit) || 0))
        : null;
      const totalAvailableCapacity = relatedRooms.reduce(
        (sum, room) => sum + (Number(room.availableCapacity) || 0),
        0
      );

      return {
        ...facility,
        distanceKm,
        minPrice,
        totalAvailableCapacity,
        rooms: relatedRooms,
      };
    });
  }, [coldRooms, facilities, userLocation]);

  const filteredFacilities = useMemo(() => {
    let items = facilitiesWithDistance;

    if (district) {
      items = items.filter((facility) => facility.district === district);
    }

    if (sector) {
      items = items.filter((facility) => facility.sector === sector);
    }

    if (searchTerm.trim()) {
      const query = searchTerm.trim().toLowerCase();
      items = items.filter(
        (facility) =>
          facility.name?.toLowerCase().includes(query) ||
          facility.description?.toLowerCase().includes(query) ||
          facility.address?.toLowerCase().includes(query)
      );
    }

    if (nearMeOnly && userLocation) {
      const numericRadius = Number(radiusKm) || 25;
      items = items.filter(
        (facility) => facility.distanceKm != null && facility.distanceKm <= numericRadius
      );
    }

    return [...items].sort((a, b) => {
      if (a.distanceKm == null && b.distanceKm == null) {
        return (b.totalAvailableCapacity || 0) - (a.totalAvailableCapacity || 0);
      }
      if (a.distanceKm == null) return 1;
      if (b.distanceKm == null) return -1;
      return a.distanceKm - b.distanceKm;
    });
  }, [district, sector, searchTerm, nearMeOnly, radiusKm, facilitiesWithDistance, userLocation]);

  const effectiveSelectedFacilityId = useMemo(() => {
    if (!filteredFacilities.length) {
      return null;
    }

    return filteredFacilities.some((facility) => facility.id === selectedFacilityId)
      ? selectedFacilityId
      : filteredFacilities[0].id;
  }, [filteredFacilities, selectedFacilityId]);

  const selectedFacility = useMemo(
    () =>
      filteredFacilities.find((facility) => facility.id === effectiveSelectedFacilityId) ||
      filteredFacilities[0] ||
      null,
    [effectiveSelectedFacilityId, filteredFacilities]
  );

  useEffect(() => {
    let active = true;

    loadGoogleMaps({ places: true })
      .then((google) => {
        if (!active || !google || !mapRef.current || !selectedFacility?.latitude || !selectedFacility?.longitude) {
          if (!hasGoogleMapsKey() && active) {
            setMapsError("Google Maps is not configured yet. Add VITE_GOOGLE_MAPS_API_KEY to show the interactive map.");
          }
          return;
        }

        const center = {
          lat: Number(selectedFacility.latitude),
          lng: Number(selectedFacility.longitude),
        };

        const map = new google.maps.Map(mapRef.current, {
          center,
          zoom: 14,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });

        new google.maps.Marker({
          map,
          position: center,
          title: selectedFacility.name,
        });

        if (userLocation) {
          new google.maps.Marker({
            map,
            position: userLocation,
            title: "Your location",
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#47A369",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            },
          });
        }

        setMapsError("");
      })
      .catch(() => {
        if (!active) return;
        setMapsError("Google Maps could not be loaded right now.");
      });

    return () => {
      active = false;
    };
  }, [selectedFacility, userLocation]);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation is not supported on this browser.");
      return;
    }

    setLocationStatus("Getting your location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setNearMeOnly(true);
        setLocationStatus("Showing facilities near your current location.");
      },
      () => {
        setLocationStatus("We could not access your location. You can still browse by district, sector, and search.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleBookNow = () => {
    if (!selectedFacility) {
      return;
    }

    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    const user = getUser();
    if (user?.role !== "FARMER") {
      navigate("/login");
      return;
    }

    navigate(`/farmer/bookings/create?facilityId=${selectedFacility.id}`);
  };

  const totalVisibleCapacity = filteredFacilities.reduce(
    (sum, facility) => sum + (Number(facility.totalAvailableCapacity) || 0),
    0
  );

  const mappedFacilityCount = filteredFacilities.filter(
    (facility) => facility.latitude != null && facility.longitude != null
  ).length;

  return (
    <div
      className={
        isDashboardView
          ? "space-y-8"
          : "min-h-screen bg-[linear-gradient(180deg,#eef8f0_0%,#f8fafc_38%,#ffffff_100%)]"
      }
    >
      <div className={isDashboardView ? "space-y-8" : "mx-auto max-w-7xl px-6 py-12"}>
        <div
          className={
            isDashboardView
              ? "overflow-hidden rounded-[2rem] border border-[#d8eadc] bg-[radial-gradient(circle_at_top_left,_rgba(71,163,105,0.18),_transparent_34%),linear-gradient(135deg,#f8fff9_0%,#eef8f0_48%,#ffffff_100%)] p-8 shadow-[0_20px_70px_rgba(48,79,58,0.08)]"
              : "max-w-3xl"
          }
        >
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#47A369]">
            {isDashboardView ? "Farmer Storage Search" : "Public Storage Search"}
          </p>
          <h1 className={`mt-3 font-black tracking-tight text-slate-900 ${isDashboardView ? "text-4xl md:text-5xl" : "text-3xl md:text-6xl"}`}>
            Find the Right Storage
          </h1>
          <p className={`mt-4 text-slate-600 ${isDashboardView ? "max-w-4xl text-base md:text-lg" : "text-lg"}`}>
            Explore storage facilities, compare rooms, check available capacity, and view the facility location on an interactive map.
            {isDashboardView
              ? " This in-account view is optimized for quick booking decisions and farmer workflows."
              : " You only need to log in when you are ready to book."}
          </p>

          {isDashboardView ? (
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-[#dcebdd]">
                <p className="text-sm text-slate-500">Visible Facilities</p>
                <p className="mt-2 text-3xl font-black text-slate-900">{filteredFacilities.length}</p>
              </div>
              <div className="rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-[#dcebdd]">
                <p className="text-sm text-slate-500">Available Capacity</p>
                <p className="mt-2 text-3xl font-black text-slate-900">{totalVisibleCapacity}</p>
              </div>
              <div className="rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-[#dcebdd]">
                <p className="text-sm text-slate-500">Mapped Facilities</p>
                <p className="mt-2 text-3xl font-black text-slate-900">{mappedFacilityCount}</p>
              </div>
            </div>
          ) : null}
        </div>

        <div className={`${isDashboardView ? "grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]" : "mt-10 grid gap-6 xl:grid-cols-[360px_1fr]"}`}>
          <aside className={`space-y-6 ${isDashboardView ? "xl:sticky xl:top-8 self-start" : ""}`}>
            <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
              <h2 className="text-lg font-semibold text-slate-900">Filter Facilities</h2>
              <div className="mt-5 space-y-4">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                  placeholder="Search by name, address, or description"
                />

                <select
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    setSector("");
                  }}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                >
                  <option value="">All Districts</option>
                  {districtOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                >
                  <option value="">All Sectors</option>
                  {sectorOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-3">
                  <input
                    id="near-me-only"
                    type="checkbox"
                    checked={nearMeOnly}
                    onChange={(e) => setNearMeOnly(e.target.checked)}
                  />
                  <label htmlFor="near-me-only" className="text-sm text-slate-700">
                    Show facilities near me
                  </label>
                </div>

                <select
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                >
                  {["10", "25", "50", "100", "200"].map((value) => (
                    <option key={value} value={value}>
                      Within {value} km
                    </option>
                  ))}
                </select>

                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleUseMyLocation}
                    className="rounded-xl bg-[#47A369] px-5 py-3 font-semibold text-white"
                  >
                    Use My Location
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDistrict("");
                      setSector("");
                      setSearchTerm("");
                      setNearMeOnly(false);
                      setRadiusKm("25");
                    }}
                    className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700"
                  >
                    Clear Filters
                  </button>
                </div>

                {locationStatus && <p className="text-sm text-slate-500">{locationStatus}</p>}
              </div>
            </div>

            <div className={`space-y-4 ${isDashboardView ? "max-h-[calc(100vh-15rem)] overflow-y-auto pr-1" : ""}`}>
              {filteredFacilities.map((facility) => (
                <button
                  key={facility.id}
                  type="button"
                  onClick={() => setSelectedFacilityId(facility.id)}
                  className={`w-full rounded-3xl border p-4 text-left shadow-sm transition ${
                    selectedFacility?.id === facility.id
                      ? "border-[#47A369] bg-[#47A369]/10"
                      : "border-slate-200 bg-white hover:border-[#47A369]/40"
                  }`}
                >
                  <p className="text-lg font-semibold text-slate-900">{facility.name}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {facility.district}
                    {facility.sector ? `, ${facility.sector}` : ""}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      {facility.rooms.length} room{facility.rooms.length === 1 ? "" : "s"}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      {facility.totalAvailableCapacity} available
                    </span>
                    {facility.minPrice != null && (
                      <span className="rounded-full bg-slate-100 px-3 py-1">
                        From {facility.minPrice}/unit
                      </span>
                    )}
                    {facility.distanceKm != null && (
                      <span className="rounded-full bg-[#47A369]/10 px-3 py-1 text-[#2d6a47]">
                        {facility.distanceKm.toFixed(1)} km away
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <section className="min-w-0">
            {!selectedFacility ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-8 py-20 text-center text-slate-500">
                No storage facilities matched your current filters.
              </div>
            ) : (
              <div className="space-y-6">
                <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_25px_80px_rgba(15,23,42,0.12)]">
                  <img
                    src={
                      photosByFacility[selectedFacility.id] ||
                      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1600&auto=format&fit=crop"
                    }
                    alt={selectedFacility.name}
                    className="h-72 w-full object-cover md:h-96"
                  />
                  <div className={`grid gap-8 p-8 ${isDashboardView ? "2xl:grid-cols-[1.45fr_0.75fr]" : "lg:grid-cols-[1.3fr_0.7fr]"}`}>
                    <div>
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#47A369]">
                            Storage Facility
                          </p>
                          <h2 className="mt-2 text-3xl font-black text-slate-900">
                            {selectedFacility.name}
                          </h2>
                          <p className="mt-3 text-slate-600">
                            {selectedFacility.address || "Address not provided"}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleBookNow}
                          className="rounded-2xl bg-[#47A369] px-6 py-3 font-semibold text-white"
                        >
                          Book This Facility
                        </button>
                      </div>

                      <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-sm text-slate-500">District</p>
                          <p className="mt-2 text-lg font-semibold text-slate-900">
                            {selectedFacility.district || "N/A"}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-sm text-slate-500">Available Capacity</p>
                          <p className="mt-2 text-lg font-semibold text-slate-900">
                            {selectedFacility.totalAvailableCapacity}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-sm text-slate-500">Starting Price</p>
                          <p className="mt-2 text-lg font-semibold text-slate-900">
                            {selectedFacility.minPrice != null ? `${selectedFacility.minPrice}/unit` : "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 rounded-2xl border border-slate-200 p-5">
                        <h3 className="text-lg font-semibold text-slate-900">About This Storage</h3>
                        <p className="mt-3 leading-7 text-slate-600">
                          {selectedFacility.description || "No description has been added for this facility yet."}
                        </p>
                        <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                          <p>Contact phone: {selectedFacility.contactPhone || "Not provided"}</p>
                          <p>Contact email: {selectedFacility.contactEmail || "Not provided"}</p>
                          <p>Sector: {selectedFacility.sector || "Not provided"}</p>
                          <p>
                            Distance from you:{" "}
                            {selectedFacility.distanceKm != null
                              ? `${selectedFacility.distanceKm.toFixed(1)} km`
                              : "Location not calculated"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl bg-[#304F3A] p-6 text-white">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                        Booking Access
                      </p>
                      <h3 className="mt-3 text-2xl font-bold">Ready to reserve space?</h3>
                      <p className="mt-3 text-white/85">
                        Anyone can browse this page. Booking starts only after you click the button.
                      </p>
                      <div className="mt-5 space-y-3 text-sm text-white/85">
                        <p>1. Review facility details and room availability.</p>
                        <p>2. Click `Book This Facility`.</p>
                        <p>3. If you are not logged in, you will go to login first.</p>
                        <p>4. If you are logged in as a farmer, you can complete the booking.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-3xl bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-xl font-bold text-slate-900">Rooms and Capacity</h3>
                      <button
                        type="button"
                        onClick={handleBookNow}
                        className="rounded-xl border border-[#47A369] px-4 py-2 font-semibold text-[#47A369]"
                      >
                        Book
                      </button>
                    </div>
                    <div className="mt-5 space-y-4">
                      {selectedFacility.rooms.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-slate-500">
                          No active cold rooms are listed for this facility yet.
                        </div>
                      ) : (
                        selectedFacility.rooms
                          .slice()
                          .sort((a, b) => Number(a.pricePerUnit) - Number(b.pricePerUnit))
                          .map((room) => (
                            <div key={room.id} className="rounded-2xl border border-slate-200 p-4">
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                  <p className="text-lg font-semibold text-slate-900">
                                    {room.name} ({room.code})
                                  </p>
                                  <p className="mt-1 text-sm text-slate-500">
                                    Temperature: {room.minTemperature ?? "N/A"} to {room.maxTemperature ?? "N/A"} degrees Celsius
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-slate-500">Available</p>
                                  <p className="text-lg font-semibold text-[#304F3A]">
                                    {room.availableCapacity}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm text-slate-600">
                                <p>Total capacity: {room.totalCapacity}</p>
                                <p>Pricing type: {room.pricingType}</p>
                                <p>Price per unit: {room.pricePerUnit}</p>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900">Facility Map</h3>
                    {selectedFacility.latitude && selectedFacility.longitude ? (
                      <>
                        <div
                          ref={mapRef}
                          className="mt-5 h-[420px] w-full rounded-3xl border border-slate-200 bg-slate-100"
                        />
                        {mapsError && <p className="mt-3 text-sm text-slate-500">{mapsError}</p>}
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${selectedFacility.latitude},${selectedFacility.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-block font-semibold text-[#47A369]"
                        >
                          Open in Google Maps
                        </a>
                      </>
                    ) : (
                      <div className="mt-5 rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-slate-500">
                        This facility does not have map coordinates yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
