import { useState, type FormEvent } from "react";

interface Props {
  onSubmit: (query: string) => void;
  loading: boolean;
  subtitle: string;
}

export function AddressBar({ onSubmit, loading, subtitle }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <form className="address-bar" onSubmit={handleSubmit}>
      <label className="address-bar__label" htmlFor="address-input">
        Your address
      </label>
      <div className="address-bar__row">
        <input
          id="address-input"
          className="address-bar__input"
          type="text"
          autoComplete="street-address"
          placeholder="e.g. Friedrichstrasse 43, 10117 Berlin"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={loading}
        />
        <button
          className="address-bar__submit"
          type="submit"
          disabled={loading || value.trim().length === 0}
        >
          {loading ? "Loading…" : "Show my house"}
        </button>
      </div>
      <p className="address-bar__hint">{subtitle}</p>
    </form>
  );
}
