import { useEffect, useRef, useState, type FormEvent } from "react";

interface Props {
  onSubmit: (query: string) => void;
  loading: boolean;
  subtitle: string;
  collapsed: boolean;
}

export function AddressBar({ onSubmit, loading, subtitle, collapsed }: Props) {
  const [value, setValue] = useState("");
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // When the parent collapses us (because a result is shown), drop our local "expanded".
  useEffect(() => {
    if (collapsed) setExpanded(false);
  }, [collapsed]);

  const showFull = !collapsed || expanded;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(value);
  };

  if (!showFull) {
    return (
      <button
        type="button"
        className="address-bar address-bar--pill"
        onClick={() => {
          setExpanded(true);
          requestAnimationFrame(() => inputRef.current?.focus());
        }}
        aria-label="Search a different address"
      >
        <span className="address-bar__pill-icon" aria-hidden>⌕</span>
        <span className="address-bar__pill-text">Try another address</span>
      </button>
    );
  }

  return (
    <form className="address-bar" onSubmit={handleSubmit}>
      <label className="address-bar__label" htmlFor="address-input">
        Your address
      </label>
      <div className="address-bar__row">
        <input
          ref={inputRef}
          id="address-input"
          className="address-bar__input"
          type="text"
          inputMode="text"
          autoComplete="street-address"
          autoCorrect="off"
          autoCapitalize="words"
          spellCheck={false}
          enterKeyHint="search"
          placeholder="Friedrichstrasse 43, Berlin"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={loading}
        />
        <button
          className="address-bar__submit"
          type="submit"
          disabled={loading || value.trim().length === 0}
          aria-label="Show my house in 3D"
        >
          {loading ? <Spinner /> : <span aria-hidden>→</span>}
        </button>
      </div>
      <p className="address-bar__hint">{subtitle}</p>
    </form>
  );
}

function Spinner() {
  return <span className="spinner" role="progressbar" aria-label="Loading" />;
}
