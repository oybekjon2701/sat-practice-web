"use client";

import { TestState } from "@/types";

const STORAGE_KEY = "sat-unfinished-tests";

interface UnfinishedTestEntry {
  mockId: string;
  mockName: string;
  savedAt: string;
  state: TestState;
}

function loadAll(): Record<string, UnfinishedTestEntry[]> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveAll(data: Record<string, UnfinishedTestEntry[]>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function saveUnfinishedTest(email: string, state: TestState) {
  const all = loadAll();
  const key = email.toLowerCase().trim();
  if (!all[key]) all[key] = [];
  const existing = all[key].findIndex((e) => e.mockId === state.mockId);
  const entry: UnfinishedTestEntry = {
    mockId: state.mockId,
    mockName: state.mockName,
    savedAt: new Date().toISOString(),
    state,
  };
  if (existing >= 0) {
    all[key][existing] = entry;
  } else {
    all[key].push(entry);
  }
  saveAll(all);
}

export function removeUnfinishedTest(email: string, mockId: string) {
  const all = loadAll();
  const key = email.toLowerCase().trim();
  if (!all[key]) return;
  all[key] = all[key].filter((e) => e.mockId !== mockId);
  saveAll(all);
}

export function getUnfinishedTests(email: string): UnfinishedTestEntry[] {
  const all = loadAll();
  const key = email.toLowerCase().trim();
  return all[key] || [];
}

export function getUnfinishedTest(email: string, mockId: string): UnfinishedTestEntry | undefined {
  return getUnfinishedTests(email).find((e) => e.mockId === mockId);
}
