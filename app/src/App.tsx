import { useCallback, useState } from "react";
import { AddressBar } from "./components/AddressBar";
import { Viewer3D } from "./components/Viewer3D";
import { geocodeAddress } from "./lib/geocode";
import type { Location } from "./lib/types";

type Status =
  | { kind: "idle" }
  | { kind: "loading"; query: string }
  | { kind: "ready"; query: string; location: Location }
  | { kind: "error"; message: string };

export function App() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const handleSubmit = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setStatus({ kind: "loading", query: trimmed });
    try {
      const location = await geocodeAddress(trimmed);
      setStatus({ kind: "ready", query: trimmed, location });
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Could not find that address.",
      });
    }
  }, []);

  return (
    <div className="app">
      <Viewer3D
        location={status.kind === "ready" ? status.location : null}
        loading={status.kind === "loading"}
      />

      <div className="overlay overlay--top">
        <header className="brand">
          <span className="brand__mark" aria-hidden>◆</span>
          <span className="brand__name">Kitkat Bulls</span>
          <span className="brand__sep">·</span>
          <span className="brand__tag">Solar, designed for your roof.</span>
        </header>

        <AddressBar
          onSubmit={handleSubmit}
          loading={status.kind === "loading"}
          subtitle={subtitleFor(status)}
        />
      </div>

      {status.kind === "ready" && (
        <div className="overlay overlay--bottom">
          <ResultCard query={status.query} location={status.location} />
        </div>
      )}

      {status.kind === "error" && (
        <div className="overlay overlay--bottom">
          <div className="error-card" role="alert">
            <strong>Couldn't load that address.</strong>
            <span>{status.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function subtitleFor(status: Status): string {
  switch (status.kind) {
    case "idle":
      return "Type an address. We'll pull a real-time 3D model of your house.";
    case "loading":
      return `Locating "${status.query}"…`;
    case "ready":
      return `Showing ${status.query}`;
    case "error":
      return "Try a more specific address (street, number, city).";
  }
}

function ResultCard({ query, location }: { query: string; location: Location }) {
  return (
    <div className="result-card">
      <div className="result-card__row">
        <span className="result-card__label">Address</span>
        <span className="result-card__value">{location.formattedAddress ?? query}</span>
      </div>
      <div className="result-card__row">
        <span className="result-card__label">Coordinates</span>
        <span className="result-card__value">
          {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
        </span>
      </div>
      <button className="cta" type="button" disabled>
        Design my solar setup
        <span className="cta__hint">Coming next</span>
      </button>
    </div>
  );
}
