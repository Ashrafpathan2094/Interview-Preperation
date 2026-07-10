"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";
import type { Question } from "@/data/types";

export default function QuestionCard({
  q,
  index,
  seen = false,
  onSeen,
}: {
  q: Question;
  index: number;
  /** User has revealed this answer before (learning progress). */
  seen?: boolean;
  onSeen?: (id: string) => void;
}) {
  const [open, setOpen] = useState(false); // answer revealed
  const [full, setFull] = useState(false); // detailed explanation expanded

  const hasShort = Boolean(q.short && q.short.trim());

  function toggle() {
    const next = !open;
    if (next) onSeen?.(q.id); // revealing an answer counts as studying it
    setOpen(next);
  }

  return (
    <article
      className={`question-card rise${open ? " is-open" : ""}${
        seen ? " is-seen" : ""
      }`}
      style={{ animationDelay: `${Math.min(index, 10) * 35}ms` }}
    >
      {/* h3 > button is the WAI-ARIA accordion pattern: the whole header is
          the click target, and the heading keeps document outline semantics. */}
      <h3 className="question-head">
        <button className="question-toggle" aria-expanded={open} onClick={toggle}>
          <span className="q-number" aria-label={seen ? "learned" : undefined}>
            {seen ? "✓" : String(index + 1).padStart(2, "0")}
          </span>
          <span className="q-text">{q.question}</span>
          {q.difficulty && (
            <span className={`badge badge-${q.difficulty}`}>
              {q.difficulty}
            </span>
          )}
          <span className="chevron" aria-hidden>
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                d="M6 9l6 6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </h3>

      {open && (
        <div className="answer">
          {hasShort ? (
            <>
              <div className="short-answer">
                <span className="short-label">Short answer</span>
                <div className="answer-prose">
                  <ReactMarkdown>{q.short as string}</ReactMarkdown>
                </div>
              </div>

              <button
                className="reveal-btn reveal-btn--secondary"
                aria-expanded={full}
                onClick={() => setFull((v) => !v)}
              >
                {full ? "Hide full explanation ▴" : "Show full explanation ▸"}
              </button>

              {full && (
                <div className="full-answer">
                  <div className="answer-prose">
                    <ReactMarkdown>{q.answer}</ReactMarkdown>
                  </div>
                  {q.code && <CodeBlock code={q.code} lang={q.codeLang} />}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="answer-prose">
                <ReactMarkdown>{q.answer}</ReactMarkdown>
              </div>
              {q.code && <CodeBlock code={q.code} lang={q.codeLang} />}
            </>
          )}

          {q.tags && q.tags.length > 0 && (
            <div className="tags">
              {q.tags.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
