# Interview Prep Site — Design Spec

**Date:** 2026-06-16
**Author:** pankajp@unfyd.com (with Claude Code)
**Status:** Awaiting review

---

## 1. Purpose

A Vercel-deployable study/interview-prep site for a developer with **3+ years**
of experience. It collects the **most-asked, market-relevant interview questions**
(sourced via research) for eight technologies, plus a Data Structures & Algorithms
section, with **detailed answers and code examples** revealed on click so the user
can self-test then check.

## 2. Goals

- One browsable page per technology, with three sections each.
- A DSA page with only **Easy** and **Hard** problems.
- Every question has a full, correct answer (explanation + code) hidden behind a
  *Show answer* toggle.
- In-page search/filter within each topic.
- Clean, modern, fast, responsive UI. Light/dark friendly.
- Deploys to Vercel with zero/minimal config.
- Content split into many small files (no monolith); routing handled by Next.js.

## 3. Non-goals (YAGNI)

- No backend, database, auth, or user accounts.
- No progress tracking / spaced repetition (could be a later phase).
- No CMS — content lives in typed source files.
- No medium-difficulty DSA problems (explicitly excluded per request).

## 4. Technologies covered

`react`, `angular`, `nodejs`, `mongodb`, `sql`, `express`, `javascript`,
`typescript` — each with three sections — plus `dsa`.

| Topic        | Sections                                   |
|--------------|--------------------------------------------|
| Each of the 8 techs | Theory · Coding/Practical · Both (mixed scenarios) |
| DSA          | Easy · Hard                                |

**"Both (mixed scenarios)"** = questions that blend theory and coding the way real
interviews do, e.g. "Explain memoization, then implement a memoized selector."

## 5. Tech stack

- **Next.js (App Router) + TypeScript** — file-based routing satisfies the
  "separate file per thing + routing" requirement natively.
- React Server Components for pages; `QuestionCard` is a client component (`"use client"`)
  because the reveal toggle and search are client state.
- Syntax highlighting via a lightweight highlighter (e.g. `highlight.js` or
  `shiki`/`prismjs`) inside `CodeBlock`. Final choice pinned during planning;
  default = `highlight.js` (no build-time complexity, small).
- Plain CSS (CSS Modules or `globals.css` + variables). No heavy UI framework.
- Deploys on Vercel out of the box (`next build`).

## 6. Routing

| URL              | Page                                             |
|------------------|--------------------------------------------------|
| `/`              | Home — grid of all 9 topics (`TopicCard`s)       |
| `/react`         | React page (3 section tabs)                      |
| `/angular`       | Angular page                                     |
| `/nodejs`        | Node.js page                                     |
| `/mongodb`       | MongoDB page                                     |
| `/sql`           | SQL page                                          |
| `/express`       | Express page                                     |
| `/javascript`    | JavaScript page                                  |
| `/typescript`    | TypeScript page                                  |
| `/dsa`           | DSA page (Easy / Hard tabs)                      |

Sections **within** a technology are **tabs on the one page** (client-side switch,
no reload). Not separate routes.

## 7. File layout

```
webchat/
├─ app/
│  ├─ layout.tsx              # shell: header + sidebar nav, theme, fonts
│  ├─ page.tsx                # home — topic grid
│  ├─ globals.css
│  ├─ react/page.tsx
│  ├─ angular/page.tsx
│  ├─ nodejs/page.tsx
│  ├─ mongodb/page.tsx
│  ├─ sql/page.tsx
│  ├─ express/page.tsx
│  ├─ javascript/page.tsx
│  ├─ typescript/page.tsx
│  └─ dsa/page.tsx
├─ components/
│  ├─ TopicCard.tsx
│  ├─ SectionTabs.tsx
│  ├─ QuestionCard.tsx        # "use client" — reveal toggle
│  ├─ CodeBlock.tsx           # syntax-highlighted code
│  ├─ SearchBar.tsx           # "use client" — filter within topic
│  └─ TopicPage.tsx           # shared layout used by each topic page
├─ data/
│  ├─ types.ts
│  ├─ react/   theory.ts  coding.ts  mixed.ts
│  ├─ angular/ theory.ts  coding.ts  mixed.ts
│  ├─ nodejs/  theory.ts  coding.ts  mixed.ts
│  ├─ mongodb/ theory.ts  coding.ts  mixed.ts
│  ├─ sql/     theory.ts  coding.ts  mixed.ts
│  ├─ express/ theory.ts  coding.ts  mixed.ts
│  ├─ javascript/ theory.ts coding.ts mixed.ts
│  ├─ typescript/ theory.ts coding.ts mixed.ts
│  └─ dsa/     easy.ts   hard.ts
├─ lib/
│  └─ topics.ts               # registry: slug → { name, blurb, sections loader }
├─ package.json
├─ tsconfig.json
├─ next.config.js
├─ README.md                  # how to run + deploy to Vercel
└─ .gitignore
```

Each section is its own file so content stays small and editable. A topic's
`page.tsx` imports its three (or two, for DSA) section files and renders them
through the shared `TopicPage`.

## 8. Data model

```ts
// data/types.ts
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;            // stable slug, unique within a section
  question: string;      // may contain inline markdown
  answer: string;        // full explanation (markdown)
  code?: string;         // optional code snippet for the answer
  codeLang?: string;     // 'jsx' | 'ts' | 'js' | 'sql' | 'bash' | ...
  tags?: string[];
  difficulty?: Difficulty;
}

export interface Section {
  id: string;            // 'theory' | 'coding' | 'mixed' | 'easy' | 'hard'
  title: string;         // display name
  questions: Question[];
}

export interface Topic {
  slug: string;          // 'react'
  name: string;          // 'React'
  blurb: string;         // one line for the home card
  sections: Section[];
}
```

- DSA problems reuse `Question`: the `answer` holds the approach + time/space
  complexity, `code` holds a **JavaScript** solution, `difficulty` is `easy`/`hard`.
- Each section file exports a typed `Section`. `lib/topics.ts` assembles topics
  from their section files.

## 9. UI / UX

- **Home (`/`):** responsive grid of topic cards (icon/accent, name, blurb,
  question count). Click → topic page.
- **Topic page:** title + blurb, `SectionTabs` (Theory / Coding / Both, or
  Easy / Hard for DSA), `SearchBar` filtering the active section by question text
  and tags, then a list of `QuestionCard`s.
- **QuestionCard:** shows the question and a *Show answer ▸* button. On click,
  expands to reveal the answer (rendered markdown) and a syntax-highlighted
  `CodeBlock` when `code` is present. Collapsible again.
- **Navigation:** persistent sidebar (or top nav on mobile) listing all topics for
  quick jumps.
- **Styling:** modern, readable, generous spacing, monospace code blocks,
  accessible color contrast, keyboard-operable toggles, mobile responsive.

## 10. Content sourcing & scope

- **Research-driven:** for each technology, gather the genuinely most-asked 3+-year
  interview questions from current market sources, dedupe, then author comprehensive
  answers with correct, runnable code. Research + authoring is fanned out per topic
  (parallel) rather than done serially.
- **Volume target:** ~**40–60 questions per technology**, split roughly
  Theory ≈ 18–22, Coding ≈ 12–18, Both ≈ 10–15 (tuned per topic).
- **DSA:** ~25 Easy + ~20 Hard classic, frequently-asked problems
  (arrays/strings, hashing, two-pointers, stacks/queues, linked lists, trees,
  graphs, recursion/backtracking, dynamic programming, intervals, heaps), each with
  a JavaScript solution, approach, and Big-O.
- All code is checked for syntactic correctness; answers are technically reviewed
  before inclusion.

## 11. Deployment

- `next build` produces a Vercel-ready app. Push to a Git provider and import into
  Vercel, or `vercel` CLI. No env vars required.
- `README.md` documents `npm install`, `npm run dev`, and the Vercel steps.

## 12. Verification

- `npm run build` (and `tsc --noEmit`) must pass — TypeScript guarantees every
  data file matches the `Question`/`Section`/`Topic` shapes.
- Lint passes (`next lint`).
- Manual smoke: home renders all 9 topics; each topic page loads, tabs switch,
  search filters, answers reveal/collapse, code highlights; DSA shows only
  Easy/Hard.

## 13. Build sequence (high level — detailed plan to follow)

1. Scaffold Next.js + TS app, base layout, theme, home grid (with placeholder data).
2. Build reusable components: `TopicCard`, `SectionTabs`, `QuestionCard`,
   `CodeBlock`, `SearchBar`, `TopicPage`.
3. Define `types.ts` and `lib/topics.ts` registry; wire one topic end-to-end with
   sample questions to validate the whole pipeline.
4. Research + author content per technology (parallel), filling the `data/**` files.
5. Author DSA Easy/Hard problems with JS solutions.
6. Polish styling/responsiveness, run build/lint/type-check, write README, verify.

## 14. Open questions

- None blocking. Git is not yet initialized in this folder; version control is
  optional and can be added on request.
