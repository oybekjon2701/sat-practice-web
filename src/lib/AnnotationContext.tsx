"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type HighlightColor = "yellow" | "pink" | "blue";

export interface Highlight {
  id: string;
  text: string;
  color: HighlightColor;
}

export interface Underline {
  id: string;
  text: string;
  style: "single" | "dashed" | "dotted";
}

export interface Note {
  id: string;
  text: string;
  content: string;
}

interface AnnotationContextType {
  highlights: Highlight[];
  underlines: Underline[];
  notes: Note[];
  addHighlight: (h: Highlight) => void;
  removeHighlight: (id: string) => void;
  addUnderline: (u: Underline) => void;
  removeUnderline: (id: string) => void;
  addNote: (n: Note) => void;
  removeNote: (id: string) => void;
  openNoteId: string | null;
  setOpenNoteId: (id: string | null) => void;
}

const AnnotationContext = createContext<AnnotationContextType | null>(null);

export function AnnotationProvider({ children }: { children: ReactNode }) {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [underlines, setUnderlines] = useState<Underline[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [openNoteId, setOpenNoteId] = useState<string | null>(null);

  return (
    <AnnotationContext.Provider
      value={{
        highlights,
        underlines,
        notes,
        addHighlight: (h) => setHighlights((prev) => [...prev, h]),
        removeHighlight: (id) => setHighlights((prev) => prev.filter((h) => h.id !== id)),
        addUnderline: (u) => setUnderlines((prev) => [...prev, u]),
        removeUnderline: (id) => setUnderlines((prev) => prev.filter((u) => u.id !== id)),
        addNote: (n) => setNotes((prev) => [...prev, n]),
        removeNote: (id) => setNotes((prev) => prev.filter((n) => n.id !== id)),
        openNoteId,
        setOpenNoteId,
      }}
    >
      {children}
    </AnnotationContext.Provider>
  );
}

export function useAnnotations() {
  const ctx = useContext(AnnotationContext);
  if (!ctx) throw new Error("useAnnotations must be used within AnnotationProvider");
  return ctx;
}

export const colorMap: Record<HighlightColor, string> = {
  yellow: "bg-yellow-200",
  pink: "bg-pink-200",
  blue: "bg-blue-200",
};

export const underlineStyles: Record<string, string> = {
  single: "underline decoration-1",
  dashed: "underline decoration-dashed decoration-1",
  dotted: "underline decoration-dotted decoration-1",
};
