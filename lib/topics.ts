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
import dsaEasy from "@/data/dsa/easy.json";
import dsaHard from "@/data/dsa/hard.json";

// JSON imports are inferred as broad literal arrays; launder them through an
// `unknown` parameter to the shared `Question` shape. The Question/Section/Topic
// types still guard everything downstream, and `next build` fails if any file is
// not valid JSON.
function section(id: string, title: string, data: unknown): Section {
  return { id, title, questions: data as Question[] };
}

function techTopic(
  slug: string,
  name: string,
  blurb: string,
  theory: unknown,
  coding: unknown,
  mixed: unknown
): Topic {
  return {
    slug,
    name,
    blurb,
    sections: [
      section("theory", "Theory", theory),
      section("coding", "Coding / Practical", coding),
      section("mixed", "Both", mixed),
    ],
  };
}

export const topics: Topic[] = [
  techTopic(
    "react",
    "React",
    "Components, hooks, rendering & performance.",
    reactTheory,
    reactCoding,
    reactMixed
  ),
  techTopic(
    "angular",
    "Angular",
    "Components, DI, RxJS & change detection.",
    angularTheory,
    angularCoding,
    angularMixed
  ),
  techTopic(
    "nodejs",
    "Node.js",
    "Event loop, streams, async & modules.",
    nodejsTheory,
    nodejsCoding,
    nodejsMixed
  ),
  techTopic(
    "mongodb",
    "MongoDB",
    "Documents, indexing, aggregation & schema design.",
    mongodbTheory,
    mongodbCoding,
    mongodbMixed
  ),
  techTopic(
    "sql",
    "SQL",
    "Joins, indexing, transactions & query tuning.",
    sqlTheory,
    sqlCoding,
    sqlMixed
  ),
  techTopic(
    "express",
    "Express",
    "Middleware, routing, errors & security.",
    expressTheory,
    expressCoding,
    expressMixed
  ),
  techTopic(
    "javascript",
    "JavaScript",
    "Closures, prototypes, async & the event loop.",
    javascriptTheory,
    javascriptCoding,
    javascriptMixed
  ),
  techTopic(
    "typescript",
    "TypeScript",
    "Types, generics, narrowing & utility types.",
    typescriptTheory,
    typescriptCoding,
    typescriptMixed
  ),
  {
    slug: "dsa",
    name: "DSA",
    blurb: "Data structures & algorithms — easy & hard only.",
    sections: [
      section("easy", "Easy", dsaEasy),
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
