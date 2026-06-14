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
        className={`flex-1 text-left flex items-start gap-3 px-4 py-3 border-2 transition-all cursor-pointer rounded-xl ${
          selected
            ? "border-[#0033aa] bg-[#e8f0fe]"
            : crossedOut
            ? "border-gray-200 bg-gray-50 opacity-50"
            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
        }`}
      >
        <span
          className={`shrink-0 w-8 h-8 flex items-center justify-center text-sm font-bold rounded-full ${
            selected
              ? "bg-[#0033aa] text-white"
              : crossedOut
              ? "bg-gray-100 text-gray-400"
              : "bg-white text-black border-2 border-gray-300"
          }`}
        >
          {label}
        </span>
        <span className={`text-sm pt-1 leading-relaxed ${crossedOut ? "text-gray-400 line-through" : "text-gray-900"}`} style={{ fontFamily: "Arial, sans-serif" }}>
          {renderMath(text)}
        </span>
      </button>
      <button
        onClick={onCrossOut}
        title={crossedOut ? "Remove cross-out" : "Cross out this option"}
        className={`shrink-0 w-7 h-7 mt-2 flex items-center justify-center text-xs border transition-colors cursor-pointer rounded-full ${
          crossedOut
            ? "bg-gray-800 text-white border-gray-800 font-bold"
            : "bg-white text-gray-400 border-gray-300 hover:bg-gray-100 hover:text-gray-600"
        }`}
      >
        {crossedOut ? "✓" : "✕"}
      </button>
    </div>
  );
}
