import TopicCard from "@/components/TopicCard";
import { topics } from "@/lib/topics";

export default function Home() {
  const totalQuestions = topics.reduce(
    (n, t) => n + t.sections.reduce((m, s) => m + s.questions.length, 0),
    0
  );

  return (
    <div className="home">
      <header className="home-hero">
        <p className="eyebrow">Crack the interview</p>
        <h1>
          Interview <em>Prep Hub</em>
        </h1>
        <p className="lede">
          Most-asked questions for 3+ years of experience — with short answers,
          deep explanations and code you can reveal on demand.
        </p>
        <div className="hero-stats" aria-label="Site stats">
          <span className="stat">
            <strong>{topics.length}</strong> topics
          </span>
          <span className="stat">
            <strong>{totalQuestions}</strong> questions
          </span>
          <span className="stat">
            <strong>3+</strong> yrs level
          </span>
        </div>
      </header>

      <div className="topic-grid">
        {topics.map((t, i) => (
          <TopicCard
            key={t.slug}
            slug={t.slug}
            name={t.name}
            blurb={t.blurb}
            count={t.sections.reduce((n, s) => n + s.questions.length, 0)}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
