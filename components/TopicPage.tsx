"use client";

import { useMemo, useState } from "react";
import SectionTabs from "./SectionTabs";
import SearchBar from "./SearchBar";
import QuestionCard from "./QuestionCard";
import type { Topic } from "@/data/types";

export default function TopicPage({ topic }: { topic: Topic }) {
  const [activeId, setActiveId] = useState(topic.sections[0]?.id ?? "");
  const [query, setQuery] = useState("");

  const section =
    topic.sections.find((s) => s.id === activeId) ?? topic.sections[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return section.questions;
    return section.questions.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        (item.tags ?? []).some((t) => t.toLowerCase().includes(q))
    );
  }, [section, query]);

  return (
    <div className="topic-page">
      <header className="topic-header">
        <h1>{topic.name}</h1>
        <p className="blurb">{topic.blurb}</p>
      </header>

      <SectionTabs
        sections={topic.sections}
        active={section.id}
        onChange={(id) => {
          setActiveId(id);
          setQuery("");
        }}
      />

      <SearchBar value={query} onChange={setQuery} />

      <p className="result-count">
        {filtered.length} question{filtered.length === 1 ? "" : "s"}
      </p>

      <div className="question-list">
        {filtered.map((q, i) => (
          <QuestionCard key={q.id} q={q} index={i} />
        ))}
        {filtered.length === 0 && (
          <p className="empty">No questions match “{query}”.</p>
        )}
      </div>
    </div>
  );
}
