import { useEffect, useRef, useState } from "react";
import {
  getGoogleMapsErrorMessage,
  hasGoogleMapsKey,
  loadGoogleMaps,
} from "../../utilis/googleMaps";

function getAddressPart(components, type) {
  return components.find((component) => component.types.includes(type))?.long_name || "";
}

export default function GoogleMapsLocationPicker({ form, setForm }) {
  const searchInputRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [mapsAvailable, setMapsAvailable] = useState(hasGoogleMapsKey());
  const [mapsError, setMapsError] = useState("");

  useEffect(() => {
    let active = true;

    loadGoogleMaps({ places: true })
      .then((google) => {
        if (!active || !google || !searchInputRef.current || !mapRef.current) {
          if (!hasGoogleMapsKey() && active) {
            setMapsAvailable(false);
          }
          return;
        }

        const defaultCenter = {
          lat: Number(form.latitude) || -1.9441,
          lng: Number(form.longitude) || 30.0619,
        };

        const map = new google.maps.Map(mapRef.current, {
          center: defaultCenter,
          zoom: form.latitude && form.longitude ? 15 : 8,
        });

        const marker = new google.maps.Marker({
          map,
          position: defaultCenter,
        });

        markerRef.current = marker;

        const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
          fields: ["formatted_address", "geometry", "address_components", "name"],
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place.geometry?.location) {
            return;
          }

          const latitude = place.geometry.location.lat();
          const longitude = place.geometry.location.lng();
          const addressComponents = place.address_components || [];
          const district =
            getAddressPart(addressComponents, "administrative_area_level_2") ||
            getAddressPart(addressComponents, "locality");
          const sector =
            getAddressPart(addressComponents, "sublocality_level_1") ||
            getAddressPart(addressComponents, "administrative_area_level_3");

          map.setCenter({ lat: latitude, lng: longitude });
          map.setZoom(15);
          marker.setPosition({ lat: latitude, lng: longitude });

          setForm((current) => ({
            ...current,
            address: place.formatted_address || current.address,
            district: district || current.district,
            sector: sector || current.sector,
            latitude: String(latitude),
            longitude: String(longitude),
          }));
        });

        map.addListener("click", (event) => {
          const latitude = event.latLng?.lat();
          const longitude = event.latLng?.lng();

          if (latitude == null || longitude == null) {
            return;
          }

          marker.setPosition({ lat: latitude, lng: longitude });

          setForm((current) => ({
            ...current,
            latitude: String(latitude),
            longitude: String(longitude),
          }));
        });

        setMapsAvailable(true);
        setMapsError("");
      })
      .catch(() => {
        if (!active) return;
        setMapsAvailable(false);
        setMapsError(
          getGoogleMapsErrorMessage() ||
            "Google Maps or Places search could not be loaded. Check your API key, billing, and Places API access."
        );
      });

    return () => {
      active = false;
    };
  }, [form.latitude, form.longitude, setForm]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 md:col-span-2">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-slate-900">Optional Google Maps Location</h3>
        <p className="text-sm text-slate-500">
          Search and pin the exact facility location if it exists on Google Maps. If not, leave this section and use district, sector, and address only.
        </p>
      </div>

      {mapsAvailable ? (
        <>
          <input
            ref={searchInputRef}
            className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Search place or address on Google Maps"
          />
          <div ref={mapRef} className="mt-4 h-80 w-full rounded-2xl border border-slate-300 bg-slate-200" />
          <p className="mt-3 text-xs text-slate-500">
            Tip: you can also click on the map to set latitude and longitude manually.
          </p>
        </>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-4 text-sm text-slate-600">
          {mapsError || "Google Maps is not configured yet. Add `VITE_GOOGLE_MAPS_API_KEY` to the frontend environment to enable map search."}
          <div className="mt-3 rounded-xl bg-amber-50 px-3 py-3 text-xs text-amber-800">
            If you see “This page didn&apos;t load Google Maps correctly”, the most common fixes are:
            enable billing, enable `Maps JavaScript API`, enable `Places API`, and allow `http://localhost:5173` in key referrer restrictions.
          </div>
        </div>
      )}
    </div>
  );
}
