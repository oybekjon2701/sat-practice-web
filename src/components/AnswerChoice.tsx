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
    <div className="flex items-start gap-2 group">
      <button
        onClick={onSelect}
        onContextMenu={(e) => { e.preventDefault(); onCrossOut(); }}
        className={`flex-1 text-left flex items-start gap-4 px-5 py-4 border-2 transition-all cursor-pointer rounded-2xl ${
          selected
            ? "border-[#0033aa] bg-[#e8f0fe]"
            : crossedOut
            ? "border-gray-100 bg-gray-50 opacity-40"
            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
        }`}
      >
        <span
          className={`shrink-0 w-9 h-9 flex items-center justify-center text-base font-bold rounded-full ${
            selected
              ? "bg-[#0033aa] text-white"
              : crossedOut
              ? "bg-gray-100 text-gray-300 line-through"
              : "bg-white text-gray-800 border-2 border-gray-300"
          }`}
        >
          {label}
        </span>
        <span className={`text-base pt-1 leading-relaxed ${crossedOut ? "text-gray-300 line-through" : "text-gray-900"}`} style={{ fontFamily: "Arial, sans-serif" }}>
          {renderMath(text)}
        </span>
      </button>
      <button
        onClick={onCrossOut}
        title={crossedOut ? "Remove cross-out" : "Cross out this option"}
        className={`shrink-0 w-9 h-9 mt-1.5 flex items-center justify-center text-lg border-2 transition-all cursor-pointer rounded-full ${
          crossedOut
            ? "bg-gray-200 text-gray-500 border-gray-300"
            : "bg-white text-gray-300 border-gray-200 opacity-0 group-hover:opacity-100 hover:border-gray-400 hover:text-gray-500"
        }`}
      >
        {crossedOut ? (
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <circle cx="10" cy="10" r="7" />
            <line x1="5" y1="10" x2="15" y2="10" />
          </svg>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="10" cy="10" r="7" />
          </svg>
        )}
      </button>
    </div>
  );
}
