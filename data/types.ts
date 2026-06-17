export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  /** Stable, unique-within-section slug, e.g. "react-virtual-dom". */
  id: string;
  /** The question text. Plain text (no markdown needed in the prompt). */
  question: string;
  /** Short TL;DR answer (1-2 sentences). Shown first; falls back to `answer` if absent. */
  short?: string;
  /** Full answer/explanation. May contain markdown (lists, **bold**, `inline code`). */
  answer: string;
  /** Optional primary code sample shown below the answer. */
  code?: string;
  /** Language hint for highlighting, e.g. "jsx" | "ts" | "js" | "sql" | "bash". */
  codeLang?: string;
  /** Optional topical tags used by search. */
  tags?: string[];
  /** Used by DSA (easy/hard) and optionally elsewhere. */
  difficulty?: Difficulty;
}

export interface Section {
  /** "theory" | "coding" | "mixed" | "easy" | "hard". */
  id: string;
  /** Display label, e.g. "Theory", "Coding / Practical", "Both". */
  title: string;
  questions: Question[];
}

export interface Topic {
  /** URL slug, e.g. "react". */
  slug: string;
  /** Display name, e.g. "React". */
  name: string;
  /** One-line description for the home card. */
  blurb: string;
  sections: Section[];
}
