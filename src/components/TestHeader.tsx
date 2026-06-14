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
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const dirRef = useRef<HTMLDivElement>(null);

  const min = Math.floor(state.timeRemaining / 60);
  const sec = state.timeRemaining % 60;
  const timeStr = `${min}:${sec.toString().padStart(2, "0")}`;
  const timerWarning = min < 5;

  useEffect(() => {
    if ("getBattery" in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener("levelchange", () => setBatteryLevel(Math.round(battery.level * 100)));
      });
    }
  }, []);

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
    <div className="shrink-0 bg-[#edf2fa]" style={{ fontFamily: "Arial, sans-serif" }}>
      <div className="h-16 flex items-center px-6" style={{ borderBottom: "3px solid transparent", backgroundImage: "repeating-linear-gradient(to right, #000 0, #000 14px, transparent 14px, transparent 22px)", backgroundRepeat: "no-repeat", backgroundSize: "100% 3px", backgroundPosition: "bottom" }}>
        <div className="flex items-center gap-8 w-[320px]">
          <div>
            <h1 className="text-base font-bold text-gray-800">Section 1, Module 1: {sectionLabel}</h1>
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

        <div className="flex-1 flex flex-col items-center gap-0.5">
          <span className={`text-3xl font-bold tabular-nums tracking-wider ${timerWarning ? "text-red-600" : "text-gray-800"}`}>
            {state.timerHidden ? "--:--" : timeStr}
          </span>
          <button onClick={() => dispatch({ type: "TOGGLE_TIMER" })} className="text-[11px] text-gray-500 border border-gray-300 rounded-full px-3 py-0.5 cursor-pointer hover:bg-gray-100 transition-colors leading-tight">
            {state.timerHidden ? "Show" : "Hide"}
          </button>
        </div>

        <div className="w-[320px] flex items-center justify-end gap-5">
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-gray-600 font-medium">{batteryLevel !== null ? `${batteryLevel}%` : ""}</span>
            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <rect x="1" y="6" width="15" height="9" rx="1" />
              <rect x="16" y="9" width="2" height="3" rx="0.5" />
              <rect x="3" y="8" width="4" height="5" fill="currentColor" opacity="0.8" rx="0.5" />
            </svg>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <button
              onClick={() => { setHighlightActive(!highlightActive); onOpenHighlightPanel(); }}
              className="cursor-pointer p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="2" width="14" height="16" rx="1" />
                <line x1="6" y1="6" x2="14" y2="6" />
                <line x1="6" y1="9" x2="14" y2="9" />
                <line x1="6" y1="12" x2="11" y2="12" />
              </svg>
            </button>
            <span className={`text-[10px] ${highlightActive ? "text-[#0033aa] font-bold" : "text-gray-500"}`}>Highlighting &amp; Notes</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <button onClick={onOpenMore} className="cursor-pointer p-1 hover:bg-gray-200 rounded transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="10" cy="4" r="2" /><circle cx="10" cy="10" r="2" /><circle cx="10" cy="16" r="2" />
              </svg>
            </button>
            <span className="text-[10px] text-gray-500">More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
