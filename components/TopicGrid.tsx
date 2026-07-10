"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getTopicMeta, TOPIC_GROUPS } from "@/lib/topicMeta";
import { getLastTopic, useAllProgress } from "@/lib/progress";

export interface CatalogItem {
  slug: string;
  name: string;
  blurb: string;
  count: number;
}

function pct(done: number, total: number) {
  if (!total) return 0;
  return Math.min(100, Math.round((done / total) * 100));
}

/* "Continue learning" banner — the zero-click resume action every
   learning platform leads with. Rendered only once progress exists. */
function ContinueCard({ items }: { items: CatalogItem[] }) {
  const counts = useAllProgress();
  const [lastSlug, setLastSlug] = useState<string | null>(null);

  useEffect(() => {
    setLastSlug(getLastTopic());
  }, []);

  const item = items.find((t) => t.slug === lastSlug);
  if (!item) return null;

  const done = counts[item.slug] ?? 0;
  const meta = getTopicMeta(item.slug);
  const percent = pct(done, item.count);

  return (
    <Link
      href={`/${item.slug}`}
      className="continue-card rise"
      style={{ "--tc": meta.color } as React.CSSProperties}
    >
      <span className="topic-glyph continue-glyph" aria-hidden>
        {meta.abbr}
      </span>
      <span className="continue-info">
        <span className="continue-label">Continue learning</span>
        <span className="continue-name">{item.name}</span>
        <span className="progress-track" aria-hidden>
          <span className="progress-fill" style={{ width: `${percent}%` }} />
        </span>
        <span className="continue-meta">
          {done} of {item.count} questions · {percent}%
        </span>
      </span>
      <span className="continue-cta">Resume →</span>
    </Link>
  );
}

function Card({
  item,
  index,
  done,
}: {
  item: CatalogItem;
  index: number;
  done: number;
}) {
  const meta = getTopicMeta(item.slug);
  const percent = pct(done, item.count);
  const started = done > 0;

  return (
    <Link
      href={`/${item.slug}`}
      className="topic-card rise"
      style={
        {
          "--tc": meta.color,
          animationDelay: `${Math.min(index, 10) * 40}ms`,
        } as React.CSSProperties
      }
    >
      <span className="card-top">
        <span className="topic-glyph" aria-hidden>
          {meta.abbr}
        </span>
        {started && (
          <span className="card-pct">
            {percent === 100 ? "✓ Done" : `${percent}%`}
          </span>
        )}
      </span>
      <h3>{item.name}</h3>
      <p>{item.blurb}</p>
      <span className="card-foot">
        <span className="progress-track" aria-hidden>
          <span className="progress-fill" style={{ width: `${percent}%` }} />
        </span>
        <span className="card-meta">
          <span>{item.count} questions</span>
          <span className="card-cta">
            {started ? "Continue" : "Start"}
            <span className="count-arrow" aria-hidden>
              →
            </span>
          </span>
        </span>
      </span>
    </Link>
  );
}

export default function TopicGrid({ items }: { items: CatalogItem[] }) {
  const [filter, setFilter] = useState<string>("all");
  const counts = useAllProgress();
  const bySlug = useMemo(
    () => Object.fromEntries(items.map((t) => [t.slug, t])),
    [items]
  );

  const groups = TOPIC_GROUPS.map((g) => ({
    ...g,
    items: g.slugs.map((s) => bySlug[s]).filter(Boolean) as CatalogItem[],
  })).filter((g) => g.items.length > 0);

  const visible =
    filter === "all" ? groups : groups.filter((g) => g.id === filter);

  return (
    <div className="catalog">
      <ContinueCard items={items} />

      <div className="filter-chips" role="tablist" aria-label="Topic groups">
        <button
          role="tab"
          aria-selected={filter === "all"}
          className={`chip${filter === "all" ? " chip-active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        {groups.map((g) => (
          <button
            key={g.id}
            role="tab"
            aria-selected={filter === g.id}
            className={`chip${filter === g.id ? " chip-active" : ""}`}
            onClick={() => setFilter(g.id)}
          >
            {g.label}
          </button>
        ))}
      </div>

      {visible.map((g) => (
        <section key={g.id} className="topic-group">
          <header className="group-head">
            <h2>{g.label}</h2>
            <span className="group-rule" aria-hidden />
            <span className="group-count">{g.items.length} topics</span>
          </header>
          <div className="topic-grid">
            {g.items.map((item, i) => (
              <Card
                key={item.slug}
                item={item}
                index={i}
                done={counts[item.slug] ?? 0}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
