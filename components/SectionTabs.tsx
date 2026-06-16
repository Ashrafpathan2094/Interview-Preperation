"use client";

import type { Section } from "@/data/types";

export default function SectionTabs({
  sections,
  active,
  onChange,
}: {
  sections: Section[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <nav className="section-tabs" role="tablist" aria-label="Sections">
      {sections.map((s) => (
        <button
          key={s.id}
          role="tab"
          aria-selected={active === s.id}
          className={`tab ${active === s.id ? "tab-active" : ""}`}
          onClick={() => onChange(s.id)}
        >
          {s.title}
          <span className="tab-count">{s.questions.length}</span>
        </button>
      ))}
    </nav>
  );
}
