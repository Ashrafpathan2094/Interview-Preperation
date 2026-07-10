import TopicGrid from "@/components/TopicGrid";
import { topics } from "@/lib/topics";

export default function Home() {
  const items = topics.map((t) => ({
    slug: t.slug,
    name: t.name,
    blurb: t.blurb,
    count: t.sections.reduce((n, s) => n + s.questions.length, 0),
  }));
  const totalQuestions = items.reduce((n, t) => n + t.count, 0);

  return (
    <div className="home">
      <header className="home-hero">
        <p className="eyebrow">Crack the interview</p>
        <h1>
          Learn it. Reveal it. <em>Nail it.</em>
        </h1>
        <p className="lede">
          {totalQuestions} most-asked questions across {items.length} topics,
          curated for 3+ years of experience — reveal short answers, deep
          explanations and runnable code, and track what you&apos;ve mastered.
        </p>
        <div className="hero-stats" aria-label="Site stats">
          <span className="stat">
            <strong>{items.length}</strong> topics
          </span>
          <span className="stat">
            <strong>{totalQuestions}</strong> questions
          </span>
          <span className="stat">
            <strong>3+</strong> yrs level
          </span>
        </div>
      </header>

      <TopicGrid items={items} />
    </div>
  );
}
