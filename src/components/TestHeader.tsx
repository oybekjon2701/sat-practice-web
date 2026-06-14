"use client";

import { useTest } from "@/lib/TestContext";

interface Props {
  onOpenCalc: () => void;
  onOpenRef: () => void;
  onOpenMore: () => void;
}

export default function TestHeader({ onOpenCalc, onOpenRef, onOpenMore }: Props) {
  const { state, dispatch } = useTest();
  const sectionLabel = state.currentSection === "reading" ? "Reading and Writing" : "Math";
  const isMath = state.currentSection === "math";

  const min = Math.floor(state.timeRemaining / 60);
  const sec = state.timeRemaining % 60;
  const timeStr = `${min}:${sec.toString().padStart(2, "0")}`;
  const timerWarning = min < 5;

  return (
    <header className="h-12 bg-white border-b border-slate-200 flex items-center px-4 shrink-0 z-40">
      <div className="w-[200px]">
        <span className="text-sm text-slate-600 font-medium">{sectionLabel} · Module {state.currentModule}</span>
      </div>

      <div className="flex-1 flex justify-center">
        <button
          onClick={() => dispatch({ type: "TOGGLE_TIMER" })}
          className={`font-mono text-xl font-bold tabular-nums tracking-wider cursor-pointer ${timerWarning ? "text-red-500" : "text-slate-800"}`}
        >
          {state.timerHidden ? "--:--" : timeStr}
        </button>
      </div>

      <div className="flex items-center gap-1 w-[200px] justify-end">
        {isMath && (
          <>
            <button onClick={onOpenCalc} className="px-2 py-1 text-xs text-slate-500 hover:bg-slate-50 rounded transition-colors cursor-pointer">Calc</button>
            <button onClick={onOpenRef} className="px-2 py-1 text-xs text-slate-500 hover:bg-slate-50 rounded transition-colors cursor-pointer">Ref</button>
          </>
        )}
        <button onClick={onOpenMore} className="px-2 py-1 text-slate-500 hover:bg-slate-50 rounded transition-colors cursor-pointer">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="10" cy="4" r="1.5" /><circle cx="10" cy="10" r="1.5" /><circle cx="10" cy="16" r="1.5" />
          </svg>
        </button>
      </div>
    </header>
  );
}
