"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Lightweight localStorage-backed learning progress.
 *
 * Shape: { [topicSlug]: string[] of question ids the user has revealed }.
 * A custom "ph-progress" window event keeps every mounted component in sync
 * within the tab; the native "storage" event syncs across tabs.
 */
const KEY = "prephub-progress-v1";
const LAST_KEY = "prephub-last-topic";
const EVT = "ph-progress";

type ProgressMap = Record<string, string[]>;

function read(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

function write(map: ProgressMap) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(map));
    window.dispatchEvent(new Event(EVT));
  } catch {
    // Storage full/blocked (private mode) — progress simply isn't persisted.
  }
}

export function markSeen(slug: string, id: string) {
  const map = read();
  const list = map[slug] ?? [];
  if (list.includes(id)) return;
  map[slug] = [...list, id];
  write(map);
}

export function resetTopic(slug: string) {
  const map = read();
  delete map[slug];
  write(map);
}

export function setLastTopic(slug: string) {
  try {
    window.localStorage.setItem(LAST_KEY, slug);
  } catch {
    /* ignore */
  }
}

export function getLastTopic(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(LAST_KEY);
  } catch {
    return null;
  }
}

/** Subscribe to progress and get the seen-id set for one topic. */
export function useTopicProgress(slug: string) {
  const [seen, setSeen] = useState<Set<string>>(new Set());

  useEffect(() => {
    const sync = () => setSeen(new Set(read()[slug] ?? []));
    sync(); // initial read happens post-hydration, so SSR/CSR markup match
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [slug]);

  const mark = useCallback((id: string) => markSeen(slug, id), [slug]);
  return { seen, mark };
}

/** Subscribe to progress counts for every topic (home page cards). */
export function useAllProgress() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const sync = () => {
      const map = read();
      const next: Record<string, number> = {};
      for (const [slug, ids] of Object.entries(map)) next[slug] = ids.length;
      setCounts(next);
    };
    sync();
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return counts;
}
