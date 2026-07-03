import type { Question, Section, Topic } from "@/data/types";

import reactTheory from "@/data/react/theory.json";
import reactCoding from "@/data/react/coding.json";
import reactMixed from "@/data/react/mixed.json";
import angularTheory from "@/data/angular/theory.json";
import angularCoding from "@/data/angular/coding.json";
import angularMixed from "@/data/angular/mixed.json";
import nodejsTheory from "@/data/nodejs/theory.json";
import nodejsCoding from "@/data/nodejs/coding.json";
import nodejsMixed from "@/data/nodejs/mixed.json";
import mongodbTheory from "@/data/mongodb/theory.json";
import mongodbCoding from "@/data/mongodb/coding.json";
import mongodbMixed from "@/data/mongodb/mixed.json";
import sqlTheory from "@/data/sql/theory.json";
import sqlCoding from "@/data/sql/coding.json";
import sqlMixed from "@/data/sql/mixed.json";
import expressTheory from "@/data/express/theory.json";
import expressCoding from "@/data/express/coding.json";
import expressMixed from "@/data/express/mixed.json";
import javascriptTheory from "@/data/javascript/theory.json";
import javascriptCoding from "@/data/javascript/coding.json";
import javascriptMixed from "@/data/javascript/mixed.json";
import typescriptTheory from "@/data/typescript/theory.json";
import typescriptCoding from "@/data/typescript/coding.json";
import typescriptMixed from "@/data/typescript/mixed.json";
import htmlTheory from "@/data/html/theory.json";
import htmlCoding from "@/data/html/coding.json";
import htmlMixed from "@/data/html/mixed.json";
import cssTheory from "@/data/css/theory.json";
import cssCoding from "@/data/css/coding.json";
import cssMixed from "@/data/css/mixed.json";
import gitTheory from "@/data/git/theory.json";
import gitCoding from "@/data/git/coding.json";
import gitMixed from "@/data/git/mixed.json";
import webapisTheory from "@/data/web-apis/theory.json";
import webapisCoding from "@/data/web-apis/coding.json";
import webapisMixed from "@/data/web-apis/mixed.json";
import sysdesignTheory from "@/data/system-design/theory.json";
import sysdesignCoding from "@/data/system-design/coding.json";
import sysdesignMixed from "@/data/system-design/mixed.json";
import nextjsTheory from "@/data/nextjs/theory.json";
import nextjsCoding from "@/data/nextjs/coding.json";
import nextjsMixed from "@/data/nextjs/mixed.json";
import nestjsTheory from "@/data/nestjs/theory.json";
import nestjsCoding from "@/data/nestjs/coding.json";
import nestjsMixed from "@/data/nestjs/mixed.json";
import dsaEasy from "@/data/dsa/easy.json";
import dsaMedium from "@/data/dsa/medium.json";
import dsaHard from "@/data/dsa/hard.json";

// JSON imports are inferred as broad literal arrays; launder them through an
// `unknown` parameter to the shared `Question` shape. The Question/Section/Topic
// types still guard everything downstream, and `next build` fails if any file is
// not valid JSON.
function section(id: string, title: string, data: unknown): Section {
  return { id, title, questions: data as Question[] };
}

const DEFAULT_TITLES: [string, string, string] = [
  "Theory",
  "Coding / Practical",
  "Both",
];

// Standard three-section topic. `titles` overrides the tab labels (e.g. for
// System Design, where "write code" does not apply). Section ids stay stable
// (theory/coding/mixed) so the tab + URL logic is uniform.
function topic3(
  slug: string,
  name: string,
  blurb: string,
  theory: unknown,
  coding: unknown,
  mixed: unknown,
  titles: [string, string, string] = DEFAULT_TITLES
): Topic {
  return {
    slug,
    name,
    blurb,
    sections: [
      section("theory", titles[0], theory),
      section("coding", titles[1], coding),
      section("mixed", titles[2], mixed),
    ],
  };
}

// Ordered as a rough learning curriculum: language → markup/style → frameworks
// → backend → data → web/APIs → tooling → design → DSA.
export const topics: Topic[] = [
  topic3(
    "javascript",
    "JavaScript",
    "Closures, prototypes, async & the event loop.",
    javascriptTheory,
    javascriptCoding,
    javascriptMixed
  ),
  topic3(
    "typescript",
    "TypeScript",
    "Types, generics, narrowing & utility types.",
    typescriptTheory,
    typescriptCoding,
    typescriptMixed
  ),
  topic3(
    "html",
    "HTML",
    "Semantic markup, forms, accessibility & metadata.",
    htmlTheory,
    htmlCoding,
    htmlMixed
  ),
  topic3(
    "css",
    "CSS",
    "Box model, flexbox, grid, specificity & responsive design.",
    cssTheory,
    cssCoding,
    cssMixed
  ),
  topic3(
    "react",
    "React",
    "Components, hooks, rendering & performance.",
    reactTheory,
    reactCoding,
    reactMixed
  ),
  topic3(
    "nextjs",
    "Next.js",
    "App Router, server components, rendering & caching.",
    nextjsTheory,
    nextjsCoding,
    nextjsMixed
  ),
  topic3(
    "angular",
    "Angular",
    "Components, DI, RxJS & change detection.",
    angularTheory,
    angularCoding,
    angularMixed
  ),
  topic3(
    "nodejs",
    "Node.js",
    "Event loop, streams, async & modules.",
    nodejsTheory,
    nodejsCoding,
    nodejsMixed
  ),
  topic3(
    "express",
    "Express",
    "Middleware, routing, errors & security.",
    expressTheory,
    expressCoding,
    expressMixed
  ),
  topic3(
    "nestjs",
    "NestJS",
    "Modules, DI, guards, pipes & interceptors.",
    nestjsTheory,
    nestjsCoding,
    nestjsMixed
  ),
  topic3(
    "mongodb",
    "MongoDB",
    "Documents, indexing, aggregation & schema design.",
    mongodbTheory,
    mongodbCoding,
    mongodbMixed
  ),
  topic3(
    "sql",
    "SQL",
    "Joins, indexing, transactions & query tuning.",
    sqlTheory,
    sqlCoding,
    sqlMixed
  ),
  topic3(
    "web-apis",
    "Web & REST APIs",
    "HTTP, REST design, auth, CORS & caching.",
    webapisTheory,
    webapisCoding,
    webapisMixed
  ),
  topic3(
    "git",
    "Git",
    "Branching, merge vs rebase, conflicts & workflows.",
    gitTheory,
    gitCoding,
    gitMixed
  ),
  topic3(
    "system-design",
    "System Design",
    "Scaling, caching, data stores & architecture trade-offs.",
    sysdesignTheory,
    sysdesignCoding,
    sysdesignMixed,
    ["Concepts", "Design Exercises", "Scenarios"]
  ),
  {
    slug: "dsa",
    name: "DSA",
    blurb: "Data structures & algorithms — easy, medium & hard.",
    sections: [
      section("easy", "Easy", dsaEasy),
      section("medium", "Medium", dsaMedium),
      section("hard", "Hard", dsaHard),
    ],
  },
];

export const topicMap: Record<string, Topic> = Object.fromEntries(
  topics.map((t) => [t.slug, t])
);

export function getTopic(slug: string): Topic | undefined {
  return topicMap[slug];
}
