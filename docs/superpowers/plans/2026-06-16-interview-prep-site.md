# Interview Prep Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Vercel-deployable Next.js (App Router + TypeScript) interview-prep site with one routed page per technology (React, Angular, Node.js, MongoDB, SQL, Express, JavaScript, TypeScript) — each with Theory / Coding / Both tabs — plus a DSA page (Easy / Hard), every question carrying a reveal-on-click answer with code.

**Architecture:** File-based routing (one folder per topic). Content lives in typed `data/**` section files, fully decoupled from presentation. A small registry (`lib/topics.ts`) assembles section files into `Topic` objects. Pages are server components; interactive pieces (tabs, search, answer reveal) are client components. Syntax highlighting via `highlight.js`; answer prose via `react-markdown`.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript 5, highlight.js, react-markdown. Plain CSS. No backend, no DB, no test framework.

**Verification model:** This is a content-presentation app, so correctness is enforced by TypeScript (every data file must satisfy the `Question`/`Section`/`Topic` types), a clean `next build`, `next lint`, and a manual smoke pass — not a unit-test harness (YAGNI). Verification steps below use `npx tsc --noEmit`, `npm run build`, `npm run lint`, and `npm run dev`.

---

## File Structure

| File | Responsibility |
|------|----------------|
| `package.json`, `tsconfig.json`, `next.config.js`, `.gitignore`, `.eslintrc.json` | Project config |
| `app/layout.tsx` | App shell: sidebar nav, fonts, global wrap |
| `app/globals.css` | All styling (layout, cards, tabs, code, responsive) |
| `app/page.tsx` | Home — topic grid |
| `app/<topic>/page.tsx` (×9) | One route per topic; renders shared `TopicPage` |
| `data/types.ts` | `Question` / `Section` / `Topic` types |
| `data/<tech>/theory.ts`, `coding.ts`, `mixed.ts` (×8) | Section content, one file each |
| `data/dsa/easy.ts`, `data/dsa/hard.ts` | DSA content |
| `lib/topics.ts` | Registry assembling sections → topics; lookups |
| `components/CodeBlock.tsx` | Syntax-highlighted code |
| `components/QuestionCard.tsx` | Question + reveal-on-click answer (client) |
| `components/SectionTabs.tsx` | Theory/Coding/Both (or Easy/Hard) switcher (client) |
| `components/SearchBar.tsx` | Filter input (client) |
| `components/TopicPage.tsx` | Composes tabs+search+list; holds UI state (client) |
| `components/TopicCard.tsx` | Home-grid card |
| `README.md` | Run + deploy instructions |

---

## Task 1: Scaffold the Next.js + TypeScript project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.js`
- Create: `.eslintrc.json`
- Create: `.gitignore`
- Create: `next-env.d.ts`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "interview-prep",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "highlight.js": "11.10.0",
    "react-markdown": "9.0.1"
  },
  "devDependencies": {
    "typescript": "5.5.4",
    "@types/node": "20.14.10",
    "@types/react": "18.3.3",
    "@types/react-dom": "18.3.0",
    "eslint": "8.57.0",
    "eslint-config-next": "14.2.5"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create `next.config.js`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;
```

- [ ] **Step 4: Create `.eslintrc.json`**

```json
{
  "extends": "next/core-web-vitals"
}
```

- [ ] **Step 5: Create `.gitignore`**

```gitignore
node_modules
.next
out
.DS_Store
*.log
.vercel
.env*.local
next-env.d.ts
```

- [ ] **Step 6: Create `next-env.d.ts`**

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

- [ ] **Step 7: Install dependencies**

Run: `npm install`
Expected: dependencies install, `node_modules` and `package-lock.json` created, no error exit code.

- [ ] **Step 8: Commit (if git initialized)**

```bash
git add package.json tsconfig.json next.config.js .eslintrc.json .gitignore next-env.d.ts package-lock.json
git commit -m "chore: scaffold Next.js + TypeScript project"
```

---

## Task 2: Define content types

**Files:**
- Create: `data/types.ts`

- [ ] **Step 1: Create `data/types.ts`**

```ts
export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  /** Stable, unique-within-section slug, e.g. "react-virtual-dom". */
  id: string;
  /** The question text. Plain text (no markdown needed in the prompt). */
  question: string;
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
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS (no errors).

- [ ] **Step 3: Commit**

```bash
git add data/types.ts
git commit -m "feat: add content types"
```

---

## Task 3: CodeBlock component

**Files:**
- Create: `components/CodeBlock.tsx`

- [ ] **Step 1: Create `components/CodeBlock.tsx`**

```tsx
"use client";

import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import sql from "highlight.js/lib/languages/sql";
import bash from "highlight.js/lib/languages/bash";
import json from "highlight.js/lib/languages/json";
import css from "highlight.js/lib/languages/css";
import "highlight.js/styles/github-dark.css";

// Register once at module load. Aliases map common lang hints to a grammar.
const langs: Record<string, unknown> = {
  javascript,
  js: javascript,
  jsx: javascript,
  typescript,
  ts: typescript,
  tsx: typescript,
  xml,
  html: xml,
  sql,
  bash,
  sh: bash,
  json,
  css,
};
for (const [name, def] of Object.entries(langs)) {
  if (!hljs.getLanguage(name)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hljs.registerLanguage(name, def as any);
  }
}

export default function CodeBlock({
  code,
  lang = "javascript",
}: {
  code: string;
  lang?: string;
}) {
  const html = hljs.getLanguage(lang)
    ? hljs.highlight(code, { language: lang }).value
    : hljs.highlightAuto(code).value;

  return (
    <pre className="code-block">
      <code
        className={`hljs language-${lang}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </pre>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add components/CodeBlock.tsx
git commit -m "feat: add syntax-highlighted CodeBlock"
```

---

## Task 4: QuestionCard component (reveal-on-click)

**Files:**
- Create: `components/QuestionCard.tsx`

- [ ] **Step 1: Create `components/QuestionCard.tsx`**

```tsx
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
  const [open, setOpen] = useState(false);

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
          <div className="answer-prose">
            <ReactMarkdown>{q.answer}</ReactMarkdown>
          </div>
          {q.code && <CodeBlock code={q.code} lang={q.codeLang} />}
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
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add components/QuestionCard.tsx
git commit -m "feat: add QuestionCard with reveal-on-click answer"
```

---

## Task 5: SectionTabs component

**Files:**
- Create: `components/SectionTabs.tsx`

- [ ] **Step 1: Create `components/SectionTabs.tsx`**

```tsx
"use client";

import type { Section } from "@/data/types";

export default function SectionTabs({
  sections,
  active,
  onChange,
}: {
  sections: Section[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <nav className="section-tabs" role="tablist" aria-label="Sections">
      {sections.map((s) => (
        <button
          key={s.id}
          role="tab"
          aria-selected={active === s.id}
          className={`tab ${active === s.id ? "tab-active" : ""}`}
          onClick={() => onChange(s.id)}
        >
          {s.title}
          <span className="tab-count">{s.questions.length}</span>
        </button>
      ))}
    </nav>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add components/SectionTabs.tsx
git commit -m "feat: add SectionTabs"
```

---

## Task 6: SearchBar component

**Files:**
- Create: `components/SearchBar.tsx`

- [ ] **Step 1: Create `components/SearchBar.tsx`**

```tsx
"use client";

export default function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="search"
      className="search-bar"
      value={value}
      placeholder={placeholder ?? "Search questions…"}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Search questions"
    />
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add components/SearchBar.tsx
git commit -m "feat: add SearchBar"
```

---

## Task 7: TopicPage component (tabs + search + list state)

**Files:**
- Create: `components/TopicPage.tsx`

- [ ] **Step 1: Create `components/TopicPage.tsx`**

```tsx
"use client";

import { useMemo, useState } from "react";
import SectionTabs from "./SectionTabs";
import SearchBar from "./SearchBar";
import QuestionCard from "./QuestionCard";
import type { Topic } from "@/data/types";

export default function TopicPage({ topic }: { topic: Topic }) {
  const [activeId, setActiveId] = useState(topic.sections[0]?.id ?? "");
  const [query, setQuery] = useState("");

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
    <div className="topic-page">
      <header className="topic-header">
        <h1>{topic.name}</h1>
        <p className="blurb">{topic.blurb}</p>
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

      <p className="result-count">
        {filtered.length} question{filtered.length === 1 ? "" : "s"}
      </p>

      <div className="question-list">
        {filtered.map((q, i) => (
          <QuestionCard key={q.id} q={q} index={i} />
        ))}
        {filtered.length === 0 && (
          <p className="empty">No questions match “{query}”.</p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add components/TopicPage.tsx
git commit -m "feat: add TopicPage with tab + search state"
```

---

## Task 8: TopicCard + registry + seed React data (prove the pipeline end-to-end)

This task wires ONE topic fully so the whole stack is validated before bulk content authoring. It uses 3 placeholder React questions that will be expanded in Task 11.

**Files:**
- Create: `components/TopicCard.tsx`
- Create: `data/react/theory.ts`
- Create: `data/react/coding.ts`
- Create: `data/react/mixed.ts`
- Create: `lib/topics.ts`

- [ ] **Step 1: Create `components/TopicCard.tsx`**

```tsx
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
```

- [ ] **Step 2: Create `data/react/theory.ts` (seed; expanded later)**

```ts
import type { Section } from "@/data/types";

const section: Section = {
  id: "theory",
  title: "Theory",
  questions: [
    {
      id: "react-virtual-dom",
      question: "What is the virtual DOM and how does reconciliation work?",
      answer:
        "The **virtual DOM** is an in-memory representation of the UI. On state change React builds a new virtual tree and **diffs** it against the previous one (reconciliation), computing the minimal set of real DOM mutations. Keys help React match list items across renders so it can reuse nodes instead of recreating them.",
      tags: ["virtual-dom", "reconciliation", "rendering"],
    },
    {
      id: "react-keys",
      question: "Why are keys important in lists and what happens with index keys?",
      answer:
        "Keys give list items a stable identity across renders. Using the array **index** as a key breaks when items are reordered/inserted/removed because React then matches the wrong elements, causing state to attach to the wrong row and subtle bugs. Use a stable unique id instead.",
      tags: ["keys", "lists"],
    },
  ],
};

export default section;
```

- [ ] **Step 3: Create `data/react/coding.ts` (seed)**

```ts
import type { Section } from "@/data/types";

const section: Section = {
  id: "coding",
  title: "Coding / Practical",
  questions: [
    {
      id: "react-debounce-hook",
      question: "Implement a useDebounce hook.",
      answer:
        "Store the value in state and update it only after the delay has elapsed since the last change, clearing the timer on each change/unmount.",
      code: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}`,
      codeLang: "tsx",
      tags: ["hooks", "useEffect"],
    },
  ],
};

export default section;
```

- [ ] **Step 4: Create `data/react/mixed.ts` (seed)**

```ts
import type { Section } from "@/data/types";

const section: Section = {
  id: "mixed",
  title: "Both",
  questions: [
    {
      id: "react-memoization-build",
      question:
        "Explain memoization in React, then implement a component that avoids unnecessary child re-renders.",
      answer:
        "Memoization caches a result keyed by inputs. In React, `React.memo` skips re-rendering a child when props are shallow-equal, `useMemo` caches a computed value, and `useCallback` caches a function identity so memoized children don't see a 'new' prop each render. Below, `Child` is wrapped in `React.memo` and its `onClick` is stabilized with `useCallback`.",
      code: `import React, { useCallback, useState } from "react";

const Child = React.memo(function Child({ onClick }: { onClick: () => void }) {
  console.log("Child render");
  return <button onClick={onClick}>Increment</button>;
});

export default function Parent() {
  const [count, setCount] = useState(0);
  const onClick = useCallback(() => setCount((c) => c + 1), []);
  return (
    <>
      <p>{count}</p>
      <Child onClick={onClick} />
    </>
  );
}`,
      codeLang: "tsx",
      tags: ["memoization", "React.memo", "useCallback"],
    },
  ],
};

export default section;
```

- [ ] **Step 5: Create `lib/topics.ts`**

Note: imports for techs other than React are added in Task 11 when their data files exist. The DSA imports are added in Task 12. For now only React is wired; placeholder topics keep the home grid populated with `[]` sections until their content lands.

```ts
import type { Section, Topic } from "@/data/types";

import reactTheory from "@/data/react/theory";
import reactCoding from "@/data/react/coding";
import reactMixed from "@/data/react/mixed";

function techTopic(
  slug: string,
  name: string,
  blurb: string,
  theory: Section,
  coding: Section,
  mixed: Section
): Topic {
  return { slug, name, blurb, sections: [theory, coding, mixed] };
}

// Empty section placeholder used until a topic's content is authored.
const empty = (id: string, title: string): Section => ({
  id,
  title,
  questions: [],
});

const placeholderTech = (slug: string, name: string, blurb: string): Topic =>
  techTopic(
    slug,
    name,
    blurb,
    empty("theory", "Theory"),
    empty("coding", "Coding / Practical"),
    empty("mixed", "Both")
  );

export const topics: Topic[] = [
  techTopic(
    "react",
    "React",
    "Components, hooks, rendering & performance.",
    reactTheory,
    reactCoding,
    reactMixed
  ),
  placeholderTech("angular", "Angular", "Components, DI, RxJS & change detection."),
  placeholderTech("nodejs", "Node.js", "Event loop, streams, async & modules."),
  placeholderTech("mongodb", "MongoDB", "Documents, indexing, aggregation & schema design."),
  placeholderTech("sql", "SQL", "Joins, indexing, transactions & query tuning."),
  placeholderTech("express", "Express", "Middleware, routing, errors & security."),
  placeholderTech("javascript", "JavaScript", "Closures, prototypes, async & the event loop."),
  placeholderTech("typescript", "TypeScript", "Types, generics, narrowing & utility types."),
  {
    slug: "dsa",
    name: "DSA",
    blurb: "Data structures & algorithms — easy & hard only.",
    sections: [empty("easy", "Easy"), empty("hard", "Hard")],
  },
];

export const topicMap: Record<string, Topic> = Object.fromEntries(
  topics.map((t) => [t.slug, t])
);

export function getTopic(slug: string): Topic | undefined {
  return topicMap[slug];
}
```

- [ ] **Step 6: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add components/TopicCard.tsx data/react lib/topics.ts
git commit -m "feat: add topic registry, TopicCard, and seed React content"
```

---

## Task 9: App shell, home page, global styles

**Files:**
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`

- [ ] **Step 1: Create `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { topics } from "@/lib/topics";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Interview Prep — 3+ Years",
  description:
    "Most-asked interview questions for React, Angular, Node.js, MongoDB, SQL, Express, JavaScript, TypeScript & DSA, with detailed answers and code.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={montserrat.variable}>
        <div className="app-shell">
          <aside className="sidebar">
            <Link href="/" className="brand">
              Prep<span>Hub</span>
            </Link>
            <nav className="side-nav" aria-label="Topics">
              {topics.map((t) => (
                <Link key={t.slug} href={`/${t.slug}`}>
                  {t.name}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create `app/page.tsx`**

```tsx
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
```

- [ ] **Step 3: Create `app/globals.css`**

```css
:root {
  --bg: #0f1220;
  --surface: #181c2e;
  --surface-2: #1f2438;
  --border: #2a3047;
  --text: #e7e9f3;
  --muted: #9aa3c0;
  --accent: #6ea8fe;
  --accent-2: #b794f6;
  --easy: #3fb950;
  --hard: #f85149;
  --radius: 12px;
  --font-body: "Trebuchet MS", "Segoe UI", system-ui, sans-serif;
  --font-head: var(--font-heading), "Montserrat", var(--font-body);
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  line-height: 1.6;
}

h1, h2, h3, .brand { font-family: var(--font-head); letter-spacing: -0.01em; }

a { color: inherit; text-decoration: none; }

.app-shell { display: flex; min-height: 100vh; }

.sidebar {
  width: 220px;
  flex-shrink: 0;
  background: var(--surface);
  border-right: 1px solid var(--border);
  padding: 1.25rem 1rem;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.brand { font-size: 1.4rem; font-weight: 700; display: block; margin-bottom: 1.5rem; }
.brand span { color: var(--accent); }

.side-nav { display: flex; flex-direction: column; gap: 0.25rem; }
.side-nav a {
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  color: var(--muted);
  font-weight: 600;
}
.side-nav a:hover { background: var(--surface-2); color: var(--text); }

.content { flex: 1; padding: 2rem clamp(1rem, 4vw, 3rem); max-width: 980px; }

/* Home */
.home-hero h1 { font-size: 2.2rem; margin: 0 0 0.5rem; }
.home-hero p { color: var(--muted); max-width: 60ch; }
.topic-grid {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}
.topic-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem;
  transition: transform 0.12s ease, border-color 0.12s ease;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.topic-card:hover { transform: translateY(-3px); border-color: var(--accent); }
.topic-card h2 { margin: 0; font-size: 1.25rem; }
.topic-card p { margin: 0; color: var(--muted); font-size: 0.92rem; }
.topic-card .count { margin-top: auto; color: var(--accent); font-size: 0.82rem; font-weight: 600; }

/* Topic page */
.topic-header h1 { font-size: 2rem; margin: 0; }
.topic-header .blurb { color: var(--muted); margin: 0.25rem 0 1.5rem; }

.section-tabs { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
.tab {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--muted);
  padding: 0.5rem 1rem;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
  font-family: var(--font-body);
}
.tab-active { background: var(--accent); color: #0b1020; border-color: var(--accent); }
.tab-count {
  margin-left: 0.5rem;
  font-size: 0.72rem;
  opacity: 0.8;
  background: rgba(0,0,0,0.18);
  padding: 0.05rem 0.4rem;
  border-radius: 999px;
}

.search-bar {
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}
.search-bar:focus { outline: 2px solid var(--accent); border-color: var(--accent); }

.result-count { color: var(--muted); font-size: 0.85rem; margin: 0.25rem 0 1rem; }

.question-list { display: flex; flex-direction: column; gap: 0.85rem; }
.question-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.1rem 1.25rem;
}
.question-head { display: flex; align-items: baseline; gap: 0.6rem; }
.q-number { color: var(--accent); font-weight: 700; font-variant-numeric: tabular-nums; }
.q-text { margin: 0; font-size: 1.05rem; font-weight: 600; flex: 1; }

.badge {
  text-transform: uppercase;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
}
.badge-easy { background: rgba(63,185,80,0.15); color: var(--easy); }
.badge-hard { background: rgba(248,81,73,0.15); color: var(--hard); }
.badge-medium { background: rgba(110,168,254,0.15); color: var(--accent); }

.reveal-btn {
  margin-top: 0.75rem;
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--accent);
  padding: 0.4rem 0.9rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-family: var(--font-body);
}
.reveal-btn:hover { border-color: var(--accent); }

.answer { margin-top: 0.9rem; border-top: 1px dashed var(--border); padding-top: 0.9rem; }
.answer-prose :is(p, ul, ol) { margin: 0 0 0.7rem; }
.answer-prose code {
  background: var(--surface-2);
  padding: 0.1rem 0.35rem;
  border-radius: 5px;
  font-size: 0.88em;
}

.code-block {
  background: #0b1020;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1rem;
  overflow-x: auto;
  font-size: 0.86rem;
  margin: 0.5rem 0;
}
.code-block code { font-family: "Consolas", "Menlo", monospace; background: none; }

.tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.8rem; }
.tag { font-size: 0.72rem; color: var(--muted); background: var(--surface-2); padding: 0.15rem 0.55rem; border-radius: 999px; }

.empty { color: var(--muted); }

/* Responsive */
@media (max-width: 760px) {
  .app-shell { flex-direction: column; }
  .sidebar {
    width: 100%;
    height: auto;
    position: static;
    display: flex;
    align-items: center;
    gap: 1rem;
    overflow-x: auto;
  }
  .brand { margin: 0; }
  .side-nav { flex-direction: row; flex-wrap: nowrap; }
}
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/page.tsx app/globals.css
git commit -m "feat: add app shell, home page, and global styles"
```

---

## Task 10: Topic routes + end-to-end smoke

Create the nine route pages. Each is a thin server component that looks up its topic and renders `TopicPage`. They are identical except for the slug string.

**Files:**
- Create: `app/react/page.tsx`
- Create: `app/angular/page.tsx`
- Create: `app/nodejs/page.tsx`
- Create: `app/mongodb/page.tsx`
- Create: `app/sql/page.tsx`
- Create: `app/express/page.tsx`
- Create: `app/javascript/page.tsx`
- Create: `app/typescript/page.tsx`
- Create: `app/dsa/page.tsx`

- [ ] **Step 1: Create `app/react/page.tsx`**

```tsx
import TopicPage from "@/components/TopicPage";
import { getTopic } from "@/lib/topics";
import { notFound } from "next/navigation";

export default function Page() {
  const topic = getTopic("react");
  if (!topic) notFound();
  return <TopicPage topic={topic} />;
}
```

- [ ] **Step 2: Create the other 8 pages**

Repeat Step 1's exact file, changing only the `getTopic("...")` slug, for:
`app/angular/page.tsx` → `"angular"`,
`app/nodejs/page.tsx` → `"nodejs"`,
`app/mongodb/page.tsx` → `"mongodb"`,
`app/sql/page.tsx` → `"sql"`,
`app/express/page.tsx` → `"express"`,
`app/javascript/page.tsx` → `"javascript"`,
`app/typescript/page.tsx` → `"typescript"`,
`app/dsa/page.tsx` → `"dsa"`.

Example (`app/dsa/page.tsx`):

```tsx
import TopicPage from "@/components/TopicPage";
import { getTopic } from "@/lib/topics";
import { notFound } from "next/navigation";

export default function Page() {
  const topic = getTopic("dsa");
  if (!topic) notFound();
  return <TopicPage topic={topic} />;
}
```

- [ ] **Step 3: Run the dev server and smoke-test**

Run: `npm run dev`
Open `http://localhost:3000` and verify:
- Home shows all 9 topic cards; React shows a non-zero count, others show 0.
- `/react` renders, three tabs switch (Theory/Coding/Both), search filters, "Show answer" reveals prose + highlighted code and toggles back.
- Sidebar links navigate between topics.

Stop the dev server (Ctrl+C) when done.

- [ ] **Step 4: Production build**

Run: `npm run build`
Expected: build succeeds, all 9 routes + `/` listed, no type or lint errors.

- [ ] **Step 5: Commit**

```bash
git add app
git commit -m "feat: add all topic routes; pipeline verified end-to-end"
```

---

## Task 11: Author content for all eight technologies

For EACH technology, replace the seed/placeholder section files with comprehensive, research-sourced content and wire the topic into `lib/topics.ts`. Run one research-and-authoring unit per technology (these are independent and parallelizable). React already has a wired structure — expand it; the other seven create their `data/<tech>/` folder with three files.

**Per-technology acceptance criteria (apply to every tech below):**
- ~40–60 questions total, split roughly **Theory ≈18–22, Coding ≈12–18, Both ≈10–15**.
- Questions reflect genuinely **most-asked 3+-year interview** topics (research current sources; dedupe near-identical questions).
- Every question has a complete, technically-correct `answer` (markdown). Coding/Both questions include a correct `code` sample with the right `codeLang`.
- Every `id` is unique within its section; add useful `tags`.
- Each section file matches the structure of the React seed files (default-export a typed `Section`).

**Files per tech (×8):** `data/<tech>/theory.ts`, `data/<tech>/coding.ts`, `data/<tech>/mixed.ts`
where `<tech>` ∈ {react, angular, nodejs, mongodb, sql, express, javascript, typescript}.

**Question object template (copy this shape):**

```ts
{
  id: "<tech>-<short-slug>",
  question: "…",
  answer: "… markdown allowed …",
  code: "… optional code …",
  codeLang: "ts", // or jsx/js/sql/bash…
  tags: ["…"],
}
```

**Suggested topic coverage to research per tech (non-exhaustive guidance for the authoring agent):**
- **React:** hooks (use*, custom, rules), reconciliation/keys, context vs state libs, memoization (memo/useMemo/useCallback), effects & cleanup, refs, Suspense/lazy, error boundaries, controlled vs uncontrolled, performance, SSR/CSR, React 18 concurrent features.
- **Angular:** components/modules/standalone, DI & providers, change detection (default vs OnPush, zone.js), RxJS operators & subscriptions, lifecycle hooks, directives & pipes, forms (template vs reactive), routing & guards, signals, AOT/Ivy.
- **Node.js:** event loop phases, libuv, async patterns (callbacks/promises/async-await), streams & backpressure, EventEmitter, cluster/worker_threads, modules (CJS vs ESM), error handling, buffers, memory/GC, process & env.
- **MongoDB:** documents/BSON, CRUD, indexing (compound, multikey, text), aggregation pipeline, schema design & embedding vs referencing, transactions, replication & sharding, read/write concerns, `$lookup`, performance.
- **SQL:** joins (inner/outer/self), normalization, indexing & query plans, transactions & ACID, isolation levels, window functions, GROUP BY/HAVING, subqueries vs CTEs, deadlocks, query optimization.
- **Express:** middleware chain & order, routing & params, error-handling middleware, `req`/`res` lifecycle, body parsing, serving static, security (helmet, CORS, rate limiting), auth (JWT/sessions), structuring apps, async error handling.
- **JavaScript:** closures, scope & hoisting, `this` & binding, prototypes & inheritance, event loop/microtasks/macrotasks, promises & async-await, `var/let/const`, coercion & equality, currying/debounce/throttle, modules, `map/filter/reduce`, generators.
- **TypeScript:** structural typing, interfaces vs types, generics & constraints, union/intersection, narrowing & guards, utility types (Partial/Pick/Omit/Record…), `keyof`/`typeof`/indexed access, conditional & mapped types, enums, decorators, `unknown` vs `any`, declaration merging.

- [ ] **Step 1: React — expand `data/react/{theory,coding,mixed}.ts` to the acceptance criteria.**
- [ ] **Step 2: Angular — create `data/angular/{theory,coding,mixed}.ts`.**
- [ ] **Step 3: Node.js — create `data/nodejs/{theory,coding,mixed}.ts`.**
- [ ] **Step 4: MongoDB — create `data/mongodb/{theory,coding,mixed}.ts`.**
- [ ] **Step 5: SQL — create `data/sql/{theory,coding,mixed}.ts`.**
- [ ] **Step 6: Express — create `data/express/{theory,coding,mixed}.ts`.**
- [ ] **Step 7: JavaScript — create `data/javascript/{theory,coding,mixed}.ts`.**
- [ ] **Step 8: TypeScript — create `data/typescript/{theory,coding,mixed}.ts`.**

- [ ] **Step 9: Wire all techs into `lib/topics.ts`**

Replace each `placeholderTech(...)` entry with a real `techTopic(...)` call importing the three section files. Final imports block:

```ts
import reactTheory from "@/data/react/theory";
import reactCoding from "@/data/react/coding";
import reactMixed from "@/data/react/mixed";
import angularTheory from "@/data/angular/theory";
import angularCoding from "@/data/angular/coding";
import angularMixed from "@/data/angular/mixed";
import nodejsTheory from "@/data/nodejs/theory";
import nodejsCoding from "@/data/nodejs/coding";
import nodejsMixed from "@/data/nodejs/mixed";
import mongodbTheory from "@/data/mongodb/theory";
import mongodbCoding from "@/data/mongodb/coding";
import mongodbMixed from "@/data/mongodb/mixed";
import sqlTheory from "@/data/sql/theory";
import sqlCoding from "@/data/sql/coding";
import sqlMixed from "@/data/sql/mixed";
import expressTheory from "@/data/express/theory";
import expressCoding from "@/data/express/coding";
import expressMixed from "@/data/express/mixed";
import javascriptTheory from "@/data/javascript/theory";
import javascriptCoding from "@/data/javascript/coding";
import javascriptMixed from "@/data/javascript/mixed";
import typescriptTheory from "@/data/typescript/theory";
import typescriptCoding from "@/data/typescript/coding";
import typescriptMixed from "@/data/typescript/mixed";
```

And the `topics` array uses `techTopic("angular", "Angular", "…", angularTheory, angularCoding, angularMixed)` etc. (remove `placeholderTech` and the `empty` helper once no longer used by the tech entries; DSA still uses `empty` until Task 12).

- [ ] **Step 10: Type-check after each tech and after wiring**

Run: `npx tsc --noEmit`
Expected: PASS. (TypeScript catches any malformed question object.)

- [ ] **Step 11: Commit (per tech or in a batch)**

```bash
git add data lib/topics.ts
git commit -m "content: author interview questions for all eight technologies"
```

---

## Task 12: Author the DSA section (Easy + Hard, JavaScript solutions)

**Files:**
- Create: `data/dsa/easy.ts`
- Create: `data/dsa/hard.ts`
- Modify: `lib/topics.ts`

**Acceptance criteria:**
- `easy.ts`: ~25 classic, frequently-asked **Easy** problems. `hard.ts`: ~20 **Hard** problems.
- Coverage across: arrays/strings, hashing, two-pointers/sliding-window, stacks/queues, linked lists, trees, graphs/BFS-DFS, recursion/backtracking, dynamic programming, intervals, heaps, binary search.
- Each problem: `question` = problem statement; `answer` = approach + **time/space complexity** (markdown); `code` = a correct **JavaScript** solution with `codeLang: "js"`; `difficulty` set to `"easy"` or `"hard"` accordingly.
- Unique `id` per problem.

- [ ] **Step 1: Create `data/dsa/easy.ts`** — section `{ id: "easy", title: "Easy", questions: [...] }`, ~25 problems matching the template below.

```ts
import type { Section } from "@/data/types";

const section: Section = {
  id: "easy",
  title: "Easy",
  questions: [
    {
      id: "dsa-two-sum",
      question: "Two Sum — return indices of the two numbers that add up to target.",
      answer:
        "Use a hash map of value→index. For each number, check whether `target - num` was already seen; if so return both indices. Single pass. **Time O(n), Space O(n).**",
      code: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`,
      codeLang: "js",
      difficulty: "easy",
      tags: ["array", "hash-map"],
    },
    // … ~24 more easy problems …
  ],
};

export default section;
```

- [ ] **Step 2: Create `data/dsa/hard.ts`** — section `{ id: "hard", title: "Hard", questions: [...] }`, ~20 problems with the same shape, `difficulty: "hard"`.

```ts
import type { Section } from "@/data/types";

const section: Section = {
  id: "hard",
  title: "Hard",
  questions: [
    {
      id: "dsa-median-two-sorted",
      question: "Median of Two Sorted Arrays in O(log(m+n)).",
      answer:
        "Binary-search the smaller array for a partition where every left-side element ≤ every right-side element; the median comes from the boundary values. **Time O(log(min(m,n))), Space O(1).**",
      code: `function findMedianSortedArrays(a, b) {
  if (a.length > b.length) [a, b] = [b, a];
  const m = a.length, n = b.length;
  let lo = 0, hi = m;
  while (lo <= hi) {
    const i = (lo + hi) >> 1;
    const j = ((m + n + 1) >> 1) - i;
    const aL = i === 0 ? -Infinity : a[i - 1];
    const aR = i === m ? Infinity : a[i];
    const bL = j === 0 ? -Infinity : b[j - 1];
    const bR = j === n ? Infinity : b[j];
    if (aL <= bR && bL <= aR) {
      if ((m + n) % 2) return Math.max(aL, bL);
      return (Math.max(aL, bL) + Math.min(aR, bR)) / 2;
    } else if (aL > bR) hi = i - 1;
    else lo = i + 1;
  }
  return 0;
}`,
      codeLang: "js",
      difficulty: "hard",
      tags: ["binary-search", "array"],
    },
    // … ~19 more hard problems …
  ],
};

export default section;
```

- [ ] **Step 3: Wire DSA into `lib/topics.ts`**

Add imports and replace the DSA placeholder entry:

```ts
import dsaEasy from "@/data/dsa/easy";
import dsaHard from "@/data/dsa/hard";
// …
{
  slug: "dsa",
  name: "DSA",
  blurb: "Data structures & algorithms — easy & hard only.",
  sections: [dsaEasy, dsaHard],
},
```

Remove the now-unused `empty` helper if nothing else references it.

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add data/dsa lib/topics.ts
git commit -m "content: add DSA easy & hard problems with JS solutions"
```

---

## Task 13: Polish, README, and final verification

**Files:**
- Create: `README.md`
- Modify: `app/globals.css` (only if smoke-test reveals issues)

- [ ] **Step 1: Create `README.md`**

```markdown
# Interview Prep Hub

A Next.js (App Router + TypeScript) study site of the most-asked interview
questions for 3+ years of experience: React, Angular, Node.js, MongoDB, SQL,
Express, JavaScript, TypeScript, plus a DSA section (Easy & Hard). Each question
has a reveal-on-click answer with code.

## Run locally

```bash
npm install
npm run dev
# http://localhost:3000
```

## Build

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push this folder to a Git provider (GitHub/GitLab/Bitbucket).
2. Import the repo at https://vercel.com/new — framework auto-detected as Next.js.
3. Deploy. No environment variables required.

Or with the CLI: `npm i -g vercel && vercel`.

## Editing content

Content lives in `data/<topic>/<section>.ts`. Each file default-exports a typed
`Section`. Add a question object (`id`, `question`, `answer`, optional `code` /
`codeLang` / `tags` / `difficulty`) and it appears automatically.
```

- [ ] **Step 2: Full smoke test**

Run: `npm run dev`
Verify across several topics (React, SQL, JavaScript, DSA):
- Counts on home match content; all 9 cards present.
- Tabs switch; search filters by question text, answer text, and tags; "no match" message appears for nonsense queries.
- Answers reveal/collapse; code is highlighted; markdown (lists/bold/inline code) renders.
- DSA shows only Easy/Hard with difficulty badges.
- Mobile width (≤760px): sidebar collapses to a horizontal bar; layout is usable.

Stop the dev server.

- [ ] **Step 3: Type-check, lint, build**

Run: `npx tsc --noEmit`
Expected: PASS.

Run: `npm run lint`
Expected: no errors.

Run: `npm run build`
Expected: build succeeds; all routes prerendered.

- [ ] **Step 4: Commit**

```bash
git add README.md app/globals.css
git commit -m "docs: add README; final polish and verification"
```

---

## Self-Review (completed during planning)

- **Spec coverage:** Next.js+TS (T1), routing per topic (T10), separate files per section (T8/11/12), types (T2), reveal-on-click (T4), 3 sections incl. mixed (T8/11), DSA easy+hard JS (T12), search (T6/7), tabs (T5/7), home grid (T8/9), comprehensive volume (T11/12 acceptance criteria), Vercel deploy (T13 README), verification (T13). All spec sections map to a task.
- **Placeholder scan:** Content tasks (11/12) intentionally describe *what* to author with acceptance criteria + a concrete object template rather than hand-listing 500 questions — the questions are the deliverable of the authoring pass, not the plan. All *code* steps (config, types, components, pages, registry) contain complete, runnable code.
- **Type consistency:** `Question`/`Section`/`Topic` (T2) are used consistently; `getTopic`, `topics`, `techTopic`, `empty`, `placeholderTech` names match across T8/T10/T11/T12; `CodeBlock` props (`code`, `lang`) and `QuestionCard` props (`q`, `index`) match their call sites.
```
