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
        className={`flex-1 text-left flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
          selected
            ? "border-[#1a73e8] bg-blue-50 ring-1 ring-[#1a73e8]/30"
            : crossedOut
            ? "border-gray-200 bg-gray-50 opacity-60"
            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
        }`}
      >
        <span
          className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${
            selected
              ? "bg-[#1a73e8] text-white"
              : crossedOut
              ? "bg-gray-200 text-gray-400"
              : "bg-gray-100 text-gray-600 border border-gray-200"
          }`}
        >
          {label}
        </span>
        <span className={`text-sm leading-relaxed pt-1 ${crossedOut ? "text-gray-400 line-through" : "text-gray-800"}`}>
          {renderMath(text)}
        </span>
      </button>
      <button
        onClick={onCrossOut}
        title={crossedOut ? "Remove cross-out" : "Cross out this option"}
        className={`shrink-0 w-9 h-8 mt-3 flex items-center justify-center rounded text-xs border transition-colors cursor-pointer ${
          crossedOut
            ? "bg-red-50 text-red-500 border-red-300 font-bold"
            : "bg-white text-gray-300 border-gray-200 hover:text-red-400 hover:border-red-300"
        }`}
      >
        {crossedOut ? "✓" : "✕"}
      </button>
    </div>
  );
}
