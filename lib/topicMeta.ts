/**
 * Per-topic visual identity: brand-ish accent color + short monogram glyph.
 *
 * Lives in its own module (NOT lib/topics.ts) on purpose: client components
 * import this for styling, and importing lib/topics.ts from a client component
 * would pull every question JSON into the browser bundle.
 */
export interface TopicMeta {
  /** Accent color used for glows, dots and glyph tiles (dark-bg friendly). */
  color: string;
  /** 2–3 char monogram rendered in the glyph tile. */
  abbr: string;
}

const TOPIC_META: Record<string, TopicMeta> = {
  javascript: { color: "#f7df1e", abbr: "JS" },
  typescript: { color: "#4c9aff", abbr: "TS" },
  html: { color: "#f4623a", abbr: "<>" },
  css: { color: "#38bdf8", abbr: "{}" },
  react: { color: "#61dafb", abbr: "Re" },
  nextjs: { color: "#f1f5f9", abbr: "Nx" },
  angular: { color: "#c084fc", abbr: "Ng" },
  nodejs: { color: "#a3e635", abbr: "No" },
  express: { color: "#9aa7b8", abbr: "Ex" },
  nestjs: { color: "#fb4a72", abbr: "Ns" },
  mongodb: { color: "#34d399", abbr: "DB" },
  sql: { color: "#2dd4bf", abbr: "SQL" },
  "web-apis": { color: "#fbbf24", abbr: "API" },
  git: { color: "#ff5533", abbr: "Git" },
  "system-design": { color: "#e879f9", abbr: "SD" },
  dsa: { color: "#ffa94d", abbr: "DSA" },
};

const FALLBACK: TopicMeta = { color: "#6ea8fe", abbr: "?" };

export function getTopicMeta(slug: string): TopicMeta {
  return TOPIC_META[slug] ?? FALLBACK;
}
