import { getGoogleMapsApiKey } from "./env";
import type { Location } from "./types";

interface GeocodeResponse {
  status: string;
  error_message?: string;
  results: Array<{
    formatted_address: string;
    geometry: { location: { lat: number; lng: number } };
  }>;
}

export async function geocodeAddress(address: string): Promise<Location> {
  const key = getGoogleMapsApiKey();
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", address);
  url.searchParams.set("key", key);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Geocoding failed: HTTP ${res.status}`);
  }
  const data = (await res.json()) as GeocodeResponse;

  if (data.status !== "OK" || data.results.length === 0) {
    throw new Error(data.error_message ?? `No results for "${address}".`);
  }

  const top = data.results[0];
  return {
    latitude: top.geometry.location.lat,
    longitude: top.geometry.location.lng,
    formattedAddress: top.formatted_address,
  };
}
