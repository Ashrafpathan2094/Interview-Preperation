import Link from "next/link";

export default function TopicCard({
  slug,
  name,
  blurb,
  count,
}: {
  slug: string;
  name: string;
  blurb: string;
  count: number;
}) {
  return (
    <Link href={`/${slug}`} className="topic-card">
      <h2>{name}</h2>
      <p>{blurb}</p>
      <span className="count">{count} questions</span>
    </Link>
  );
}
