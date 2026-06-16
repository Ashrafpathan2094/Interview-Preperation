"use client";

import hljs from "highlight.js/lib/core";
import type { LanguageFn } from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import sql from "highlight.js/lib/languages/sql";
import bash from "highlight.js/lib/languages/bash";
import json from "highlight.js/lib/languages/json";
import css from "highlight.js/lib/languages/css";
import "highlight.js/styles/github-dark.css";

// Register once at module load. Aliases map common lang hints to a grammar.
const langs: Record<string, LanguageFn> = {
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
    hljs.registerLanguage(name, def);
  }
}

export default function CodeBlock({
  code,
  lang = "javascript",
}: {
  code: string;
  lang?: string;
}) {
  // SAFETY: `html` is the output of highlight.js over our own authored code
  // samples (static data files) — never user input. highlight.js HTML-escapes
  // its input and emits only <span> wrappers, so this cannot inject markup.
  // If this site ever renders user-submitted code, sanitize (e.g. DOMPurify).
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
