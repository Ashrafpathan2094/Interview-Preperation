import TopicCard from "@/components/TopicCard";
import { topics } from "@/lib/topics";

export default function Home() {
  return (
    <div className="home">
      <header className="home-hero">
        <h1>Interview Prep Hub</h1>
        <p>
          Most-asked questions for 3+ years of experience — with detailed
          answers and code you can reveal on demand.
        </p>
      </header>
      <div className="topic-grid">
        {topics.map((t) => (
          <TopicCard
            key={t.slug}
            slug={t.slug}
            name={t.name}
            blurb={t.blurb}
            count={t.sections.reduce((n, s) => n + s.questions.length, 0)}
          />
        ))}
      </div>
    </div>
  );
}
