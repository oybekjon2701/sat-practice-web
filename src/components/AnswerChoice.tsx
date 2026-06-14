"use client";
import { renderMath } from "@/lib/renderMath";

interface Props {
  label: string;
  text: string;
  selected: boolean;
  crossedOut: boolean;
  showCrossOut: boolean;
  onSelect: () => void;
  onCrossOut: () => void;
}

export default function AnswerChoice({ label, text, selected, crossedOut, showCrossOut, onSelect, onCrossOut }: Props) {
  return (
    <div className="flex items-start gap-2">
      <button
        onClick={onSelect}
        className={`flex-1 text-left flex items-start gap-4 px-5 py-4 border-2 transition-all cursor-pointer rounded-2xl ${
          selected
            ? "border-[#0033aa] bg-[#e8f0fe]"
            : crossedOut
            ? "border-gray-100 bg-gray-50 opacity-40"
            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
        }`}
      >
        <span
          className={`shrink-0 w-9 h-9 flex items-center justify-center text-base font-bold rounded-full border-2 ${
            selected
              ? "bg-[#0033aa] text-white border-[#0033aa]"
              : crossedOut
              ? "bg-gray-100 text-gray-300 line-through border-gray-200"
              : "bg-white text-gray-800 border-gray-300"
          }`}
        >
          {label}
        </span>
        <span className={`text-base pt-1 leading-relaxed ${crossedOut ? "text-gray-300 line-through" : "text-gray-900"}`} style={{ fontFamily: "Arial, sans-serif" }}>
          {renderMath(text)}
        </span>
      </button>
      {showCrossOut && (
        <button
          onClick={onCrossOut}
          title={crossedOut ? "Remove cross-out" : "Cross out this option"}
          className={`shrink-0 w-9 h-9 mt-1.5 flex items-center justify-center text-base font-bold border-2 transition-all cursor-pointer rounded-full ${
            crossedOut
              ? "bg-gray-200 text-gray-500 border-gray-300 line-through"
              : "bg-white text-gray-400 border-gray-300 hover:border-gray-500 hover:text-gray-600"
          }`}
        >
          {label}
        </button>
      )}
    </div>
  );
}
