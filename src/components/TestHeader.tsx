"use client";

import { useTest } from "@/lib/TestContext";
import { useState, useRef, useEffect } from "react";

interface Props {
  onOpenCalc: () => void;
  onOpenRef: () => void;
  onOpenMore: () => void;
  onOpenHighlightPanel: () => void;
}

export default function TestHeader({ onOpenCalc, onOpenRef, onOpenMore, onOpenHighlightPanel }: Props) {
  const { state, dispatch } = useTest();
  const sectionLabel = state.currentSection === "reading" ? "Reading and Writing" : "Math";
  const [showDirections, setShowDirections] = useState(false);
  const [highlightActive, setHighlightActive] = useState(false);
  const dirRef = useRef<HTMLDivElement>(null);

  const min = Math.floor(state.timeRemaining / 60);
  const sec = state.timeRemaining % 60;
  const timeStr = `${min}:${sec.toString().padStart(2, "0")}`;
  const timerWarning = min < 5;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dirRef.current && !dirRef.current.contains(e.target as Node)) {
        setShowDirections(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="shrink-0 bg-[#edf2fa] border-b border-gray-200" style={{ fontFamily: "Arial, sans-serif" }}>
      <div className="h-14 flex items-center px-5">
        <div className="flex items-center gap-6 w-[300px]">
          <div>
            <h1 className="text-sm font-bold text-gray-800">Section 1, Module 1: {sectionLabel}</h1>
            <div className="relative" ref={dirRef}>
              <button onClick={() => setShowDirections(!showDirections)} className="text-xs text-[#0033aa] underline cursor-pointer flex items-center gap-0.5">
                Directions <span className="text-sm leading-none">▾</span>
              </button>
              {showDirections && (
                <div className="absolute top-5 left-0 bg-white border border-gray-200 text-sm text-gray-700 p-3 w-80 z-50 shadow-lg rounded-lg">
                  <p className="mb-1 font-bold text-gray-800">Directions</p>
                  <p>{state.currentSection === "reading" ? "Each passage or paired set is followed by one or more questions. Read each passage carefully and select the best answer for each question." : "You may use a calculator for all math questions. Some questions require you to enter your answer in a grid-in box."}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center">
          <span className={`text-2xl font-bold tabular-nums tracking-wider ${timerWarning ? "text-red-600" : "text-gray-800"}`}>
            {state.timerHidden ? "--:--" : timeStr}
          </span>
          <button onClick={() => dispatch({ type: "TOGGLE_TIMER" })} className="text-[11px] text-[#0033aa] underline cursor-pointer leading-none -mt-0.5">
            {state.timerHidden ? "Show" : "Hide"}
          </button>
        </div>

        <div className="flex items-center gap-5 w-[300px] justify-end">
          <button
            onClick={() => { setHighlightActive(!highlightActive); onOpenHighlightPanel(); }}
            className={`text-xs cursor-pointer ${highlightActive ? "text-[#0033aa] underline font-bold" : "text-[#0033aa] underline"}`}
          >
            Highlights &amp; Notes
          </button>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <rect x="1" y="6" width="15" height="9" rx="1" />
              <rect x="16" y="9" width="2" height="3" rx="0.5" />
              <rect x="3" y="8" width="3" height="5" fill="currentColor" opacity="0.8" />
              <rect x="7" y="8" width="3" height="5" fill="currentColor" opacity="0.8" />
              <rect x="11" y="8" width="3" height="5" fill="currentColor" opacity="0.6" />
            </svg>
            <span>85%</span>
          </div>
          <div className="relative">
            <button onClick={onOpenMore} className="cursor-pointer">
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="10" cy="4" r="2" /><circle cx="10" cy="10" r="2" /><circle cx="10" cy="16" r="2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
