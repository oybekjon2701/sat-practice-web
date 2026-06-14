"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { renderMath } from "@/lib/renderMath";

interface Props {
  passage: string;
  title?: string;
  imageUrl?: string;
  imageAlt?: string;
  underlinedPart?: string;
}

type HighlightColor = "yellow" | "green" | "pink" | "blue";

interface Highlight {
  id: string;
  text: string;
  color: HighlightColor;
}

interface Annotation {
  id: string;
  text: string;
}

interface Note {
  id: string;
  text: string;
  content: string;
}

type ToolMode = "read" | "highlight" | "underline" | "note";

const colorMap: Record<HighlightColor, string> = {
  yellow: "bg-yellow-200",
  green: "bg-green-200",
  pink: "bg-pink-200",
  blue: "bg-blue-200",
};

interface TextPart {
  text: string;
  highlight?: HighlightColor;
  underline?: string;
  note?: string;
  preUnderline?: boolean;
}

function annotateText(text: string, highlights: Highlight[], underlines: Annotation[], notes: Note[], underlinedPart?: string): TextPart[] {
  const all: { pos: number; end: number; type: "highlight" | "underline" | "note" | "preUnderline"; val: any }[] = [];
  if (underlinedPart) {
    const lower = underlinedPart.toLowerCase();
    const idx = text.toLowerCase().indexOf(lower);
    if (idx !== -1) all.push({ pos: idx, end: idx + underlinedPart.length, type: "preUnderline", val: true });
  }
  for (const h of highlights) {
    const lower = h.text.toLowerCase();
    const idx = text.toLowerCase().indexOf(lower);
    if (idx !== -1) all.push({ pos: idx, end: idx + h.text.length, type: "highlight", val: h.color });
  }
  for (const u of underlines) {
    const lower = u.text.toLowerCase();
    const idx = text.toLowerCase().indexOf(lower);
    if (idx !== -1) all.push({ pos: idx, end: idx + u.text.length, type: "underline", val: true });
  }
  for (const n of notes) {
    const lower = n.text.toLowerCase();
    const idx = text.toLowerCase().indexOf(lower);
    if (idx !== -1) all.push({ pos: idx, end: idx + n.text.length, type: "note", val: n.id });
  }
  all.sort((a, b) => a.pos - b.pos || (b.type === "highlight" ? 1 : -1));

  if (all.length === 0) return [{ text }];

  const parts: TextPart[] = [];
  let cursor = 0;
  for (const a of all) {
    if (a.pos > cursor) parts.push({ text: text.slice(cursor, a.pos) });
    if (a.pos < cursor) continue;
    const matched = text.slice(a.pos, a.end);
    if (a.type === "highlight") {
      parts.push({ text: matched, highlight: a.val });
    } else if (a.type === "preUnderline") {
      parts.push({ text: matched, preUnderline: true });
    } else if (a.type === "underline") {
      const existing = parts.findIndex(p => p.text === matched && p.underline);
      if (existing >= 0) {
        parts[existing] = { ...parts[existing], underline: "yes" };
      } else {
        parts.push({ text: matched, underline: "yes" });
      }
    } else if (a.type === "note") {
      parts.push({ text: matched, note: a.val });
    }
    cursor = a.end;
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor) });
  return parts;
}

function renderTextWithBlanks(text: string) {
  const parts = text.split(/(_{2,})/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    /_{2,}/.test(part)
      ? <span key={i} className="border-b-2 border-gray-400 min-w-[60px] inline-block mx-0.5">&nbsp;</span>
      : part
  );
}

function isTableBlock(text: string): boolean {
  const lines = text.split("\n").filter(l => l.trim());
  if (lines.length < 2) return false;
  const pipeCounts = lines.map(l => (l.match(/\|/g) || []).length);
  return pipeCounts.every(c => c === pipeCounts[0]) && pipeCounts[0] >= 1;
}

function renderTableBlock(text: string) {
  const lines = text.split("\n").filter(l => l.trim());
  const rows = lines.map(line => line.split("|").map(c => c.trim()));
  const header = rows[0];
  const body = rows.slice(1);
  return (
    <div className="overflow-x-auto my-2">
      <table className="min-w-full border-collapse border border-gray-300 text-xs">
        <thead>
          <tr className="bg-gray-100">
            {header.map((h, i) => <th key={i} className="border border-gray-300 px-3 py-1.5 text-left font-semibold text-gray-700">{renderTextWithBlanks(h)}</th>)}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              {row.map((c, ci) => <td key={ci} className="border border-gray-300 px-3 py-1.5 text-gray-700">{renderTextWithBlanks(c)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PassagePanel({ passage, title, imageUrl, imageAlt, underlinedPart }: Props) {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [underlines, setUnderlines] = useState<Annotation[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeColor, setActiveColor] = useState<HighlightColor>("yellow");
  const [mode, setMode] = useState<ToolMode>("read");
  const [editingNote, setEditingNote] = useState<{ text: string; content: string } | null>(null);
  const [openNoteId, setOpenNoteId] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleMouseUp = useCallback(() => {
    if (mode === "read") return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) return;
    const text = sel.toString().trim();

    if (mode === "highlight") {
      if (highlights.some((h) => h.text.toLowerCase() === text.toLowerCase())) {
        sel.removeAllRanges();
        return;
      }
      const id = `h-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setHighlights((prev) => [...prev, { id, text, color: activeColor }]);
    } else if (mode === "underline") {
      if (underlines.some((u) => u.text.toLowerCase() === text.toLowerCase())) {
        sel.removeAllRanges();
        return;
      }
      const id = `u-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setUnderlines((prev) => [...prev, { id, text }]);
    } else if (mode === "note") {
      if (notes.some((n) => n.text.toLowerCase() === text.toLowerCase())) {
        sel.removeAllRanges();
        return;
      }
      setEditingNote({ text, content: "" });
    }
    sel.removeAllRanges();
  }, [mode, activeColor, highlights, underlines, notes]);

  function removeHighlight(id: string) {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  }

  function removeUnderline(id: string) {
    setUnderlines((prev) => prev.filter((u) => u.id !== id));
  }

  function removeNote(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  function saveNote() {
    if (!editingNote || !editingNote.content.trim()) return;
    const id = `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setNotes((prev) => [...prev, { id, text: editingNote.text, content: editingNote.content.trim() }]);
    setEditingNote(null);
  }

  const paragraphs = useMemo(() => {
    if (!passage) return [];
    return passage.split("\n\n").map((para) => annotateText(para, highlights, underlines, notes, underlinedPart));
  }, [passage, highlights, underlines, notes, underlinedPart]);

  const allAnns = useMemo(() => {
    return [...highlights.map(h => ({ ...h, type: "highlight" as const })),
            ...underlines.map(u => ({ ...u, type: "underline" as const })),
            ...notes.map(n => ({ ...n, type: "note" as const }))];
  }, [highlights, underlines, notes]);

  const toolLabel: Record<ToolMode, string> = {
    read: "Read",
    highlight: "Highlighting",
    underline: "Underlining",
    note: "Notes",
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-sat-border bg-white shrink-0">
        {title && (
          <h2 className="text-xs font-semibold text-sat-gray uppercase tracking-wide">
            {title}
          </h2>
        )}
        <div className="flex items-center gap-0.5 ml-auto">
          {(["read", "highlight", "underline", "note"] as ToolMode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setOpenNoteId(null); }}
              className={`text-xs px-2 py-1 rounded transition-colors cursor-pointer ${
                mode === m
                  ? m === "highlight"
                    ? "bg-yellow-100 text-yellow-800 font-semibold"
                    : m === "underline"
                    ? "bg-blue-100 text-blue-800 font-semibold"
                    : m === "note"
                    ? "bg-green-100 text-green-800 font-semibold"
                    : "bg-gray-100 text-gray-800 font-semibold"
                  : "text-sat-gray hover:bg-sat-light"
              }`}
            >
              {m === "read" ? "Read" : m === "highlight" ? "Highlight" : m === "underline" ? "Underline" : "Note"}
            </button>
          ))}
        </div>
      </div>

      {mode === "highlight" && (
        <div className="flex items-center gap-1 px-4 py-1.5 bg-yellow-50 border-b border-yellow-200 shrink-0">
          {(["yellow", "green", "pink", "blue"] as HighlightColor[]).map((c) => (
            <button
              key={c}
              onClick={() => setActiveColor(c)}
              className={`w-5 h-5 rounded-full border-2 transition-all cursor-pointer ${
                activeColor === c ? "border-gray-800 scale-125" : "border-transparent"
              } ${colorMap[c]}`}
            />
          ))}
          <span className="text-xs text-sat-gray ml-2">Select text to highlight</span>
        </div>
      )}

      {mode === "underline" && (
        <div className="flex items-center px-4 py-1.5 bg-blue-50 border-b border-blue-200 shrink-0">
          <span className="text-xs text-sat-gray">Select text to underline</span>
        </div>
      )}

      {mode === "note" && (
        <div className="flex items-center px-4 py-1.5 bg-green-50 border-b border-green-200 shrink-0">
          <span className="text-xs text-sat-gray">Select text to add a note</span>
        </div>
      )}

      {editingNote && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center" onClick={() => setEditingNote(null)}>
          <div className="bg-white rounded-xl shadow-2xl p-5 w-80 mx-4" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm font-medium text-gray-700 mb-2">Note for:</p>
            <p className="text-xs text-gray-500 mb-3 italic bg-gray-50 rounded p-2">"{editingNote.text}"</p>
            <textarea
              className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-green-400 resize-none"
              rows={3}
              placeholder="Type your note..."
              value={editingNote.content}
              onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
              autoFocus
            />
            <div className="flex gap-2 mt-3 justify-end">
              <button onClick={() => setEditingNote(null)} className="px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50 rounded cursor-pointer">Cancel</button>
              <button onClick={saveNote} className="px-3 py-1.5 text-xs bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer">Save</button>
            </div>
          </div>
        </div>
      )}

      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto p-6"
        onMouseUp={handleMouseUp}
      >
        {imageUrl && (
          <div className="mb-4">
            <img src={imageUrl} alt={imageAlt || "Figure"} className="max-w-[300px] max-h-[200px] h-auto rounded-lg border border-sat-border" />
          </div>
        )}
        <div className="text-base leading-relaxed text-gray-800 space-y-4 relative whitespace-pre-line font-serif">
          {paragraphs.map((parts, i) => {
            const fullText = parts.map(p => p.text).join("");
            if (isTableBlock(fullText)) {
              return <div key={i}>{renderTableBlock(fullText)}</div>;
            }
            return (
              <p key={i}>
                {parts.map((part, j) => {
                  if (part.highlight) {
                    return <mark key={j} className={`${colorMap[part.highlight]} text-gray-800 rounded-sm px-0.5`}>{renderMath(renderTextWithBlanks(part.text))}</mark>;
                  }
                  if (part.preUnderline) {
                    return <span key={j} className="underline decoration-orange-500 decoration-2 underline-offset-2 text-red-700 font-medium">{renderMath(renderTextWithBlanks(part.text))}</span>;
                  }
                  if (part.underline) {
                    return <span key={j} className="underline decoration-blue-500 decoration-2 underline-offset-2">{renderMath(renderTextWithBlanks(part.text))}</span>;
                  }
                  if (part.note) {
                    const note = notes.find(n => n.id === part.note);
                    return (
                      <span key={j} className="relative group">
                        <span
                          className="cursor-help border-b-2 border-dashed border-green-500"
                          onClick={() => setOpenNoteId(openNoteId === part.note ? null : (part.note ?? null))}
                        >
                          {renderMath(renderTextWithBlanks(part.text))}
                        </span>
                        {openNoteId === part.note && note && (
                          <span className="absolute z-30 bottom-full left-0 mb-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs text-gray-700">
                            <span className="font-medium text-green-700 block mb-0.5">Note</span>
                            {renderMath(note.content)}
                          </span>
                        )}
                      </span>
                    );
                  }
                  return <span key={j}>{renderMath(renderTextWithBlanks(part.text))}</span>;
                })}
              </p>
            );
          })}
        </div>

        {allAnns.length > 0 && (
          <div className="mt-4 pt-3 border-t border-sat-border">
            <p className="text-xs font-semibold text-sat-gray mb-2">Annotations</p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {allAnns.map((a) => (
                <div key={a.id} className="flex items-center gap-2 text-xs">
                  {a.type === "highlight" && (
                    <span className={`px-1.5 py-0.5 rounded ${colorMap[(a as Highlight).color]} flex-1 truncate`}>
                      {a.text}
                    </span>
                  )}
                  {a.type === "underline" && (
                    <span className="underline decoration-blue-500 decoration-2 flex-1 truncate px-1">
                      {a.text}
                    </span>
                  )}
                  {a.type === "note" && (
                    <span className="flex-1 truncate border-b border-dashed border-green-500 px-1">
                      {a.text} — <span className="text-green-700">{(a as Note).content}</span>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      if (a.type === "highlight") removeHighlight(a.id);
                      else if (a.type === "underline") removeUnderline(a.id);
                      else if (a.type === "note") removeNote(a.id);
                    }}
                    className="text-sat-red hover:text-red-700 cursor-pointer shrink-0"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}