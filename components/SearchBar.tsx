"use client";

export default function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="search-wrap">
      <svg className="search-icon" viewBox="0 0 24 24" width="17" height="17" aria-hidden>
        <circle
          cx="11"
          cy="11"
          r="7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M20 20l-3.6-3.6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <input
        type="search"
        className="search-bar"
        value={value}
        placeholder={placeholder ?? "Search questions…"}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search questions"
      />
    </div>
  );
}
