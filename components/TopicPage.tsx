"use client";

import { useEffect, useMemo, useState } from "react";
import SectionTabs from "./SectionTabs";
import SearchBar from "./SearchBar";
import QuestionCard from "./QuestionCard";
import { getTopicMeta } from "@/lib/topicMeta";
import { setLastTopic, useTopicProgress } from "@/lib/progress";
import type { Topic } from "@/data/types";

/* Codecademy/LeetCode-style completion ring. */
function ProgressRing({ done, total }: { done: number; total: number }) {
  const R = 26;
  const C = 2 * Math.PI * R;
  const percent = total ? Math.min(1, done / total) : 0;
  return (
    <div className="progress-ring" role="img" aria-label={`${done} of ${total} questions learned`}>
      <svg viewBox="0 0 64 64" width="64" height="64">
        <circle cx="32" cy="32" r={R} className="ring-track" />
        <circle
          cx="32"
          cy="32"
          r={R}
          className="ring-fill"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - percent)}
          transform="rotate(-90 32 32)"
        />
      </svg>
      <span className="ring-label">{Math.round(percent * 100)}%</span>
    </div>
  );
}

export default function TopicPage({ topic }: { topic: Topic }) {
  const [activeId, setActiveId] = useState(topic.sections[0]?.id ?? "");
  const [query, setQuery] = useState("");

  const meta = getTopicMeta(topic.slug);
  const total = topic.sections.reduce((n, s) => n + s.questions.length, 0);
  const { seen, mark } = useTopicProgress(topic.slug);

  // Power the home page's "Continue learning" banner.
  useEffect(() => {
    setLastTopic(topic.slug);
  }, [topic.slug]);

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
    <div
      className="topic-page"
      style={{ "--tc": meta.color } as React.CSSProperties}
    >
      <header className="topic-header">
        <span className="topic-glyph topic-glyph--lg" aria-hidden>
          {meta.abbr}
        </span>
        <div className="topic-title">
          <h1>{topic.name}</h1>
          <p className="blurb">{topic.blurb}</p>
          <p className="topic-total">
            {seen.size} of {total} learned
          </p>
        </div>
        <ProgressRing done={seen.size} total={total} />
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

      <p className="result-count" role="status">
        {filtered.length} question{filtered.length === 1 ? "" : "s"}
      </p>

      <div className="question-list">
        {filtered.map((q, i) => (
          <QuestionCard
            key={q.id}
            q={q}
            index={i}
            seen={seen.has(q.id)}
            onSeen={mark}
          />
        ))}
        {filtered.length === 0 && (
          <p className="empty">No questions match “{query}”.</p>
        )}
      </div>
    </div>
  );
}
