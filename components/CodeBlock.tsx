"use client";

import { useEffect, useRef, useState } from "react";
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
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  // Clear the "Copied" reset timer if the card unmounts first.
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard API unavailable (http/permissions) — silently ignore.
    }
  }

  // SAFETY: `html` is the output of highlight.js over our own authored code
  // samples (static data files) — never user input. highlight.js HTML-escapes
  // its input and emits only <span> wrappers, so this cannot inject markup.
  // If this site ever renders user-submitted code, sanitize (e.g. DOMPurify).
  const html = hljs.getLanguage(lang)
    ? hljs.highlight(code, { language: lang }).value
    : hljs.highlightAuto(code).value;

  return (
    <figure className="code-block">
      <figcaption className="code-head">
        <span className="code-lang">{lang}</span>
        <button
          type="button"
          className="copy-btn"
          onClick={copy}
          aria-live="polite"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </figcaption>
      <pre>
        <code
          className={`hljs language-${lang}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </pre>
    </figure>
  );
}
