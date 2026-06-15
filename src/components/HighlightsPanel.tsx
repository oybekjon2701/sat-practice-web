"use client";

import { useAnnotations, colorMap, underlineStyles, Highlight, Underline, Note } from "@/lib/AnnotationContext";
import { useState } from "react";

type FilterType = "all" | "highlight" | "underline" | "note";

interface Props {
  onClose: () => void;
}

export default function HighlightsPanel({ onClose }: Props) {
  const { highlights, underlines, notes, removeHighlight, removeUnderline, removeNote } = useAnnotations();
  const [filter, setFilter] = useState<FilterType>("all");

  const items: { type: "highlight" | "underline" | "note"; data: Highlight | Underline | Note }[] = [];
  if (filter === "all" || filter === "highlight") highlights.forEach(h => items.push({ type: "highlight", data: h }));
  if (filter === "all" || filter === "underline") underlines.forEach(u => items.push({ type: "underline", data: u }));
  if (filter === "all" || filter === "note") notes.forEach(n => items.push({ type: "note", data: n }));

  const count = highlights.length + underlines.length + notes.length;

  return (
    <div className="w-80 border-l border-gray-200 bg-white flex flex-col shrink-0" style={{ fontFamily: "Arial, sans-serif" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-black bg-notice-bg">
        <span className="text-xs font-bold text-black">Annotations ({count})</span>
        <button onClick={onClose} className="text-black cursor-pointer hover:opacity-70">
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" d="M5 5l10 10M15 5L5 15" />
          </svg>
        </button>
      </div>

      <div className="flex gap-0.5 px-2 py-1.5 border-b border-black">
        {(["all", "highlight", "underline", "note"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-[10px] px-1.5 py-0.5 cursor-pointer ${
              filter === f ? "bg-black text-white" : "text-black hover:bg-notice-bg"
            }`}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {items.length === 0 && (
          <div className="p-3 text-[11px] text-gray-400 text-center">No annotations yet. Select text in the passage to highlight or add notes.</div>
        )}
        {items.map((item, idx) => (
          <div key={`${item.type}-${(item.data as any).id}-${idx}`} className="px-3 py-1.5 border-b border-black/10 last:border-b-0">
            <div className="flex items-start justify-between gap-1">
              <div className="flex-1 min-w-0">
                <span className="text-[9px] uppercase tracking-wider font-medium text-gray-500 block mb-0.5">
                  {item.type === "highlight" ? "Highlight" : item.type === "underline" ? "Underline" : "Note"}
                </span>
                <span
                  className={`text-[11px] text-black block truncate ${
                    item.type === "highlight"
                      ? colorMap[(item.data as Highlight).color] + " px-0.5"
                      : item.type === "underline"
                      ? underlineStyles[(item.data as Underline).style] + " decoration-blue-500"
                      : ""
                  }`}
                >
                  {item.type === "note" ? (item.data as Note).content : (item.data as any).text}
                </span>
              </div>
              <button
                onClick={() => {
                  if (item.type === "highlight") removeHighlight((item.data as Highlight).id);
                  else if (item.type === "underline") removeUnderline((item.data as Underline).id);
                  else removeNote((item.data as Note).id);
                }}
                className="text-gray-400 hover:text-black cursor-pointer shrink-0 mt-0.5"
              >
                <svg className="w-3 h-3" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
