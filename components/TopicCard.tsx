import Link from "next/link";
import { getTopicMeta } from "@/lib/topicMeta";

export default function TopicCard({
  slug,
  name,
  blurb,
  count,
  index = 0,
}: {
  slug: string;
  name: string;
  blurb: string;
  count: number;
  index?: number;
}) {
  const meta = getTopicMeta(slug);
  return (
    <Link
      href={`/${slug}`}
      className="topic-card rise"
      style={
        {
          "--tc": meta.color,
          animationDelay: `${Math.min(index, 12) * 45}ms`,
        } as React.CSSProperties
      }
    >
      <span className="topic-glyph" aria-hidden>
        {meta.abbr}
      </span>
      <h2>{name}</h2>
      <p>{blurb}</p>
      <span className="count">
        {count} questions
        <span className="count-arrow" aria-hidden>
          →
        </span>
      </span>
    </Link>
  );
}
