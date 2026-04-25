export function getGoogleMapsApiKey(): string {
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!key) {
    throw new Error(
      "Missing VITE_GOOGLE_MAPS_API_KEY. Copy .env.example to .env.local and add a Google Maps Platform API key with Geocoding + Map Tiles enabled.",
    );
  }
  return key;
}
