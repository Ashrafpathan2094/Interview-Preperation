"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";
import type { Question } from "@/data/types";

export default function QuestionCard({
  q,
  index,
}: {
  q: Question;
  index: number;
}) {
  const [open, setOpen] = useState(false); // answer revealed
  const [full, setFull] = useState(false); // detailed explanation expanded

  const hasShort = Boolean(q.short && q.short.trim());

  return (
    <article className="question-card">
      <header className="question-head">
        <span className="q-number">{index + 1}</span>
        <h3 className="q-text">{q.question}</h3>
        {q.difficulty && (
          <span className={`badge badge-${q.difficulty}`}>{q.difficulty}</span>
        )}
      </header>

      <button
        className="reveal-btn"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Hide answer ▴" : "Show answer ▸"}
      </button>

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
                {full
                  ? "Hide full explanation ▴"
                  : "Show full explanation ▸"}
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
