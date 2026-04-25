import { useCallback, useState } from "react";
import { AddressBar } from "./components/AddressBar";
import { Viewer3D } from "./components/Viewer3D";
import { geocodeAddress } from "./lib/geocode";
import type { Location } from "./lib/types";

type Status =
  | { kind: "idle" }
  | { kind: "loading"; query: string }
  | { kind: "ready"; query: string; location: Location }
  | { kind: "error"; query: string; message: string };

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
        query: trimmed,
        message: err instanceof Error ? err.message : "Could not find that address.",
      });
    }
  }, []);

  const handleReset = useCallback(() => {
    setStatus({ kind: "idle" });
  }, []);

  return (
    <div className="app">
      <Viewer3D
        location={status.kind === "ready" ? status.location : null}
        loading={status.kind === "loading"}
      />

      <header className="brand" aria-label="Kitkat Bulls">
        <span className="brand__mark" aria-hidden>◆</span>
        <span className="brand__name">Kitkat Bulls</span>
      </header>

      <div className="dock">
        {status.kind === "ready" && (
          <ResultSheet
            query={status.query}
            location={status.location}
            onChangeAddress={handleReset}
          />
        )}

        {status.kind === "error" && (
          <div className="toast toast--error" role="alert">
            <strong>Couldn't find that address.</strong>
            <span>{status.message}</span>
          </div>
        )}

        <AddressBar
          onSubmit={handleSubmit}
          loading={status.kind === "loading"}
          subtitle={subtitleFor(status)}
          collapsed={status.kind === "ready"}
        />
      </div>
    </div>
  );
}

function subtitleFor(status: Status): string {
  switch (status.kind) {
    case "idle":
      return "Type an address. We'll show your house in 3D.";
    case "loading":
      return `Locating "${status.query}"…`;
    case "ready":
      return `Showing ${status.query}`;
    case "error":
      return "Try a more specific address (street, number, city).";
  }
}

interface ResultSheetProps {
  query: string;
  location: Location;
  onChangeAddress: () => void;
}

function ResultSheet({ query, location, onChangeAddress }: ResultSheetProps) {
  return (
    <div className="sheet" role="region" aria-label="Result">
      <div className="sheet__handle" aria-hidden />
      <div className="sheet__row">
        <div className="sheet__label">Showing</div>
        <button
          type="button"
          className="sheet__change"
          onClick={onChangeAddress}
          aria-label="Change address"
        >
          Change
        </button>
      </div>
      <div className="sheet__address">{location.formattedAddress ?? query}</div>
      <div className="sheet__coords">
        {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
      </div>
      <button className="cta" type="button" disabled>
        <span className="cta__label">Design my solar setup</span>
        <span className="cta__hint">Coming next</span>
      </button>
    </div>
  );
}
