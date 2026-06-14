"use client";

import { useRef, useCallback, useMemo, useEffect, useState } from "react";
import { renderMath } from "@/lib/renderMath";
import { useAnnotations, colorMap, underlineStyles, Highlight, Underline, Note } from "@/lib/AnnotationContext";

interface Props {
  passage: string;
  title?: string;
  imageUrl?: string;
  imageAlt?: string;
  underlinedPart?: string;
}

interface TextPart {
  text: string;
  highlight?: string;
  underline?: string;
  note?: string;
  preUnderline?: boolean;
}

function annotateText(text: string, highlights: Highlight[], underlines: Underline[], notes: Note[], underlinedPart?: string): TextPart[] {
  const all: { pos: number; end: number; type: string; val: any }[] = [];
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
    if (idx !== -1) all.push({ pos: idx, end: idx + u.text.length, type: "underline", val: u.style });
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
    if (a.type === "highlight") parts.push({ text: matched, highlight: a.val });
    else if (a.type === "preUnderline") parts.push({ text: matched, preUnderline: true });
    else if (a.type === "underline") parts.push({ text: matched, underline: a.val });
    else if (a.type === "note") parts.push({ text: matched, note: a.val });
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
  const { highlights, underlines, notes, addHighlight, removeHighlight, addUnderline, removeUnderline, addNote, removeNote, openNoteId, setOpenNoteId } = useAnnotations();
  const [popup, setPopup] = useState<{ x: number; y: number; text: string } | null>(null);
  const [contextPopup, setContextPopup] = useState<{ x: number; y: number; text: string } | null>(null);
  const [editingNote, setEditingNote] = useState<{ text: string; content: string } | null>(null);
  const [showUnderlineDropdown, setShowUnderlineDropdown] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setPopup(null);
        setShowUnderlineDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function getSelectionInfo(): { text: string; range: Range } | null {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) return null;
    const text = sel.toString().trim();
    const range = sel.getRangeAt(0);
    return { text, range };
  }

  function getPopupPosition(range: Range): { x: number; y: number } {
    const rect = range.getBoundingClientRect();
    const container = contentRef.current;
    if (!container) return { x: rect.left, y: rect.bottom + 4 };
    const containerRect = container.getBoundingClientRect();
    return { x: rect.left - containerRect.left, y: rect.bottom - containerRect.top + 4 };
  }

  const handleMouseUp = useCallback(() => {
    const selInfo = getSelectionInfo();
    if (!selInfo) { setPopup(null); return; }
    const pos = getPopupPosition(selInfo.range);
    setPopup({ x: pos.x, y: pos.y, text: selInfo.text });
    window.getSelection()?.removeAllRanges();
  }, []);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) return;
    setContextPopup({ x: e.clientX, y: e.clientY, text: sel.toString().trim() });
  }, []);

  function handleAddHighlight(color: "yellow" | "pink" | "blue") {
    if (!popup) return;
    if (highlights.some(h => h.text.toLowerCase() === popup.text.toLowerCase())) return;
    addHighlight({ id: `h-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, text: popup.text, color });
    setPopup(null);
  }

  function handleAddUnderline(style: "single" | "dashed" | "dotted") {
    if (!popup) return;
    if (underlines.some(u => u.text.toLowerCase() === popup.text.toLowerCase())) return;
    addUnderline({ id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, text: popup.text, style });
    setPopup(null);
    setShowUnderlineDropdown(false);
  }

  function handleAddNoteFromPopup() {
    if (!popup) return;
    if (notes.some(n => n.text.toLowerCase() === popup.text.toLowerCase())) return;
    setEditingNote({ text: popup.text, content: "" });
    setPopup(null);
  }

  function handleRemoveForText(text: string) {
    highlights.filter(h => h.text.toLowerCase() === text.toLowerCase()).forEach(h => removeHighlight(h.id));
    underlines.filter(u => u.text.toLowerCase() === text.toLowerCase()).forEach(u => removeUnderline(u.id));
  }

  function handleSaveNote() {
    if (!editingNote || !editingNote.content.trim()) return;
    addNote({ id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, text: editingNote.text, content: editingNote.content.trim() });
    setEditingNote(null);
  }

  function contextAddHighlight(color: "yellow" | "pink" | "blue") {
    if (!contextPopup) return;
    if (highlights.some(h => h.text.toLowerCase() === contextPopup.text.toLowerCase())) return;
    addHighlight({ id: `h-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, text: contextPopup.text, color });
    setContextPopup(null);
  }

  function contextAddUnderline() {
    if (!contextPopup) return;
    if (underlines.some(u => u.text.toLowerCase() === contextPopup.text.toLowerCase())) return;
    addUnderline({ id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, text: contextPopup.text, style: "single" });
    setContextPopup(null);
  }

  const paragraphs = useMemo(() => {
    if (!passage) return [];
    return passage.split("\n\n").map((para) => annotateText(para, highlights, underlines, notes, underlinedPart));
  }, [passage, highlights, underlines, notes, underlinedPart]);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto px-4 py-3 relative"
        onMouseUp={handleMouseUp}
        onContextMenu={handleContextMenu}
      >
        {imageUrl && (
          <div className="mb-3">
            <img src={imageUrl} alt={imageAlt || "Figure"} className="max-w-[300px] max-h-[200px] h-auto border border-black" />
          </div>
        )}
        <div className="text-lg leading-relaxed text-black space-y-4 whitespace-pre-line font-serif" style={{ fontFamily: "Georgia, 'Times New Roman', serif", lineHeight: "1.6" }}>
          {paragraphs.map((parts, i) => {
            const fullText = parts.map(p => p.text).join("");
            if (isTableBlock(fullText)) return <div key={i}>{renderTableBlock(fullText)}</div>;
            return (
              <p key={i}>
                {parts.map((part, j) => {
                  if (part.highlight) return <mark key={j} className={`${colorMap[part.highlight as keyof typeof colorMap]} text-black px-0.5`}>{renderMath(renderTextWithBlanks(part.text))}</mark>;
                  if (part.preUnderline) return <span key={j} className="underline decoration-orange-500 decoration-2 underline-offset-2 text-red-700 font-medium">{renderMath(renderTextWithBlanks(part.text))}</span>;
                  if (part.underline) {
                    const us = underlineStyles[part.underline] || underlineStyles.single;
                    return <span key={j} className={`${us} decoration-blue-500 underline-offset-2`}>{renderMath(renderTextWithBlanks(part.text))}</span>;
                  }
                  if (part.note) {
                    const note = notes.find(n => n.id === part.note);
                    return (
                      <span key={j} className="relative group">
                        <span className="cursor-help border-b-2 border-dashed border-green-500" onClick={() => setOpenNoteId(openNoteId === part.note ? null : (part.note ?? null))}>
                          {renderMath(renderTextWithBlanks(part.text))}
                        </span>
                        {openNoteId === part.note && note && (
                          <span className="absolute z-30 bottom-full left-0 mb-1 w-56 bg-white border border-black p-3 text-xs text-black">
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

        {popup && (
          <div
            ref={popupRef}
            className="absolute z-50 flex items-center gap-1 bg-white border border-black px-1.5 py-1"
            style={{ left: popup.x, top: popup.y, fontFamily: "Arial, sans-serif" }}
          >
            <button onClick={() => handleAddHighlight("yellow")} className="w-3.5 h-3.5 rounded-full bg-yellow-300 border border-black cursor-pointer hover:ring-1 hover:ring-black" title="Yellow highlight" />
            <button onClick={() => handleAddHighlight("pink")} className="w-3.5 h-3.5 rounded-full bg-pink-300 border border-black cursor-pointer hover:ring-1 hover:ring-black" title="Pink highlight" />
            <button onClick={() => handleAddHighlight("blue")} className="w-3.5 h-3.5 rounded-full bg-blue-300 border border-black cursor-pointer hover:ring-1 hover:ring-black" title="Blue highlight" />
            <div className="w-px h-4 bg-gray-300 mx-0.5" />
            <div className="relative">
              <button onClick={() => setShowUnderlineDropdown(!showUnderlineDropdown)} className="text-[11px] font-bold text-black border border-black px-1 py-0.5 cursor-pointer hover:bg-[#f0f2f5]" title="Underline">U</button>
              {showUnderlineDropdown && (
                <div className="absolute left-0 top-full mt-0.5 bg-white border border-black z-50 min-w-[80px]">
                  <button onClick={() => handleAddUnderline("single")} className="block w-full text-left px-2 py-1 text-[10px] text-black hover:bg-[#f0f2f5] cursor-pointer underline decoration-1">Single</button>
                  <button onClick={() => handleAddUnderline("dashed")} className="block w-full text-left px-2 py-1 text-[10px] text-black hover:bg-[#f0f2f5] cursor-pointer underline decoration-dashed decoration-1">Dashed</button>
                  <button onClick={() => handleAddUnderline("dotted")} className="block w-full text-left px-2 py-1 text-[10px] text-black hover:bg-[#f0f2f5] cursor-pointer underline decoration-dotted decoration-1">Dotted</button>
                </div>
              )}
            </div>
            <button onClick={handleAddNoteFromPopup} className="text-[11px] text-black px-1 py-0.5 cursor-pointer hover:bg-[#f0f2f5]" title="Add note">
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="2" width="14" height="16" rx="1" />
                <line x1="6" y1="6" x2="14" y2="6" />
                <line x1="6" y1="9" x2="14" y2="9" />
                <line x1="6" y1="12" x2="11" y2="12" />
              </svg>
            </button>
            <div className="w-px h-4 bg-gray-300 mx-0.5" />
            <button onClick={() => { handleRemoveForText(popup.text); }} className="text-[11px] text-black px-1 py-0.5 cursor-pointer hover:bg-[#f0f2f5]" title="Remove">
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <circle cx="10" cy="10" r="7" />
                <path strokeLinecap="round" d="M7 7l6 6M13 7l-6 6" />
              </svg>
            </button>
          </div>
        )}

        {contextPopup && (
          <div
            className="fixed z-50 bg-white border border-black px-2 py-1.5 flex items-center gap-1"
            style={{ left: contextPopup.x, top: contextPopup.y, fontFamily: "Arial, sans-serif" }}
          >
            <button onClick={() => contextAddHighlight("yellow")} className="w-3.5 h-3.5 rounded-full bg-yellow-300 border border-black cursor-pointer hover:ring-1 hover:ring-black" />
            <button onClick={() => contextAddHighlight("pink")} className="w-3.5 h-3.5 rounded-full bg-pink-300 border border-black cursor-pointer hover:ring-1 hover:ring-black" />
            <button onClick={() => contextAddHighlight("blue")} className="w-3.5 h-3.5 rounded-full bg-blue-300 border border-black cursor-pointer hover:ring-1 hover:ring-black" />
            <div className="w-px h-4 bg-gray-300 mx-0.5" />
            <button onClick={contextAddUnderline} className="text-[11px] font-bold text-black border border-black px-1 py-0.5 cursor-pointer hover:bg-[#f0f2f5]">U</button>
            <button onClick={() => setContextPopup(null)} className="text-[11px] text-black px-1 py-0.5 cursor-pointer hover:bg-[#f0f2f5]">
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <circle cx="10" cy="10" r="7" />
                <path strokeLinecap="round" d="M7 7l6 6M13 7l-6 6" />
              </svg>
            </button>
          </div>
        )}

        {editingNote && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white border border-black p-4 w-72" style={{ fontFamily: "Arial, sans-serif" }}>
              <p className="text-xs font-medium text-black mb-1">Add Note</p>
              <p className="text-[11px] text-black mb-2 italic">&ldquo;{editingNote.text}&rdquo;</p>
              <textarea autoFocus value={editingNote.content} onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })} className="w-full border border-black text-xs p-1.5 mb-2 text-black resize-none" rows={3} />
              <div className="flex gap-2">
                <button onClick={() => setEditingNote(null)} className="flex-1 py-1 text-xs border border-black text-black bg-white hover:bg-[#f0f2f5] cursor-pointer">Cancel</button>
                <button onClick={handleSaveNote} className="flex-1 py-1 text-xs bg-black text-white hover:bg-[#333] cursor-pointer border border-black">Save</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {(highlights.length > 0 || underlines.length > 0 || notes.length > 0) && (
        <div className="border-t border-black px-3 py-1.5 max-h-16 overflow-y-auto">
          <div className="flex flex-wrap gap-1">
            {highlights.map(h => (
              <span key={h.id} className={`inline-flex items-center gap-0.5 px-1 text-[10px] ${colorMap[h.color]} text-black`}>
                {h.text.slice(0, 20)}{h.text.length > 20 ? "..." : ""}
                <button onClick={() => removeHighlight(h.id)} className="cursor-pointer hover:opacity-70">
                  <svg className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M5 5l10 10M15 5L5 15" /></svg>
                </button>
              </span>
            ))}
            {underlines.map(u => (
              <span key={u.id} className={`inline-flex items-center gap-0.5 px-1 text-[10px] text-black ${underlineStyles[u.style]} decoration-blue-500`}>
                {u.text.slice(0, 20)}{u.text.length > 20 ? "..." : ""}
                <button onClick={() => removeUnderline(u.id)} className="cursor-pointer hover:opacity-70">
                  <svg className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M5 5l10 10M15 5L5 15" /></svg>
                </button>
              </span>
            ))}
            {notes.map(n => (
              <span key={n.id} className="inline-flex items-center gap-0.5 px-1 text-[10px] text-green-700 border-b border-dashed border-green-500">
                {n.text.slice(0, 15)}{n.text.length > 15 ? "..." : ""}
                <button onClick={() => removeNote(n.id)} className="cursor-pointer hover:opacity-70">
                  <svg className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M5 5l10 10M15 5L5 15" /></svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
