const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

let mapsPromise = null;
let lastGoogleMapsError = "";

export function hasGoogleMapsKey() {
  return Boolean(GOOGLE_MAPS_API_KEY);
}

export function getGoogleMapsErrorMessage() {
  return lastGoogleMapsError;
}

export function loadGoogleMaps({ places = false } = {}) {
  if (!GOOGLE_MAPS_API_KEY) {
    lastGoogleMapsError = "Google Maps API key is missing.";
    return Promise.resolve(null);
  }

  if (window.google?.maps && (!places || window.google.maps.places)) {
    return Promise.resolve(window.google);
  }

  if (!mapsPromise) {
    mapsPromise = new Promise((resolve, reject) => {
      window.gm_authFailure = () => {
        lastGoogleMapsError =
          "Google Maps authentication failed. Check that billing is enabled, the Maps JavaScript API and Places API are enabled, and your key allows this localhost origin.";
        reject(new Error(lastGoogleMapsError));
      };

      const existingScript = document.querySelector('script[data-google-maps="true"]');

      if (existingScript) {
        if (window.google?.maps) {
          resolve(window.google);
          return;
        }

        existingScript.addEventListener("load", () => resolve(window.google), { once: true });
        existingScript.addEventListener("error", reject, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`;
      script.async = true;
      script.defer = true;
      script.dataset.googleMaps = "true";
      script.onload = () => resolve(window.google);
      script.onerror = () => {
        lastGoogleMapsError =
          "Google Maps script could not be loaded. Check internet access, API key validity, and allowed referrers.";
        reject(new Error(lastGoogleMapsError));
      };
      document.head.appendChild(script);
    });
  }

  return mapsPromise.then((google) => {
    if (!places || google?.maps?.places) {
      return google;
    }

    lastGoogleMapsError =
      "Google Maps loaded, but the Places library is unavailable. Check that Places API is enabled for this key.";
    throw new Error(lastGoogleMapsError);
  });
}
