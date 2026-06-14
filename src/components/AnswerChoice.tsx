"use client";
import { renderMath } from "@/lib/renderMath";

interface Props {
  label: string;
  text: string;
  selected: boolean;
  crossedOut: boolean;
  onSelect: () => void;
  onCrossOut: () => void;
}

export default function AnswerChoice({ label, text, selected, crossedOut, onSelect, onCrossOut }: Props) {
  return (
    <div className="flex items-start gap-2">
      <button
        onClick={onSelect}
        onContextMenu={(e) => { e.preventDefault(); onCrossOut(); }}
        className={`flex-1 text-left flex items-start gap-2 px-3 py-2 border transition-all cursor-pointer ${
          selected
            ? "border-2 border-[#0033aa] bg-[#e8f0fe]"
            : crossedOut
            ? "border border-black bg-[#f0f2f5] opacity-50"
            : "border border-black bg-white hover:bg-[#f0f2f5]"
        }`}
      >
        <span
          className={`shrink-0 w-7 h-7 flex items-center justify-center text-sm font-bold ${
            selected
              ? "bg-[#0033aa] text-white"
              : crossedOut
              ? "bg-[#f0f2f5] text-black"
              : "bg-white text-black border border-black"
          }`}
        >
          {label}
        </span>
        <span className={`text-sm pt-0.5 ${crossedOut ? "text-black line-through" : "text-black"}`} style={{ fontFamily: "Arial, sans-serif" }}>
          {renderMath(text)}
        </span>
      </button>
      <button
        onClick={onCrossOut}
        title={crossedOut ? "Remove cross-out" : "Cross out this option"}
        className={`shrink-0 w-7 h-7 mt-1.5 flex items-center justify-center text-xs border border-black transition-colors cursor-pointer ${
          crossedOut
            ? "bg-black text-white font-bold"
            : "bg-white text-black hover:bg-[#f0f2f5]"
        }`}
      >
        {crossedOut ? "✓" : "✕"}
      </button>
    </div>
  );
}
