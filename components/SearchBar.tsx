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
    <input
      type="search"
      className="search-bar"
      value={value}
      placeholder={placeholder ?? "Search questions…"}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Search questions"
    />
  );
}
