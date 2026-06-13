"use client";

import { useTest } from "@/lib/TestContext";

interface Props {
  onOpenCalc: () => void;
  onOpenRef: () => void;
  onOpenMore: () => void;
}

export default function TestHeader({ onOpenCalc, onOpenRef, onOpenMore }: Props) {
  const { state, dispatch } = useTest();
  const currentMod = state.modules[0];
  const currentQ = currentMod?.questions[state.currentQuestionIndex];
  const totalQ = currentMod?.questions.length ?? 0;
  const sectionLabel = state.currentSection === "reading" ? "Reading and Writing" : "Math";
  const isMath = state.currentSection === "math";

  const min = Math.floor(state.timeRemaining / 60);
  const sec = state.timeRemaining % 60;
  const timeStr = `${min}:${sec.toString().padStart(2, "0")}`;
  const timerWarning = min < 5;

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 shrink-0 shadow-sm z-40">
      <div className="flex items-center gap-2 w-[200px]">
        <svg viewBox="0 0 240 60" className="h-8 w-auto" xmlns="http://www.w3.org/2000/svg">
          <text x="235" y="34" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="22" fill="#FF6B00" text-anchor="end">satzone.</text>
          <text x="235" y="51" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="10" fill="#FF6B00" text-anchor="end" letter-spacing="1.5">SAT CENTER</text>
        </svg>
        <span className="text-gray-300 text-xs">|</span>
        <span className="text-xs text-gray-500 font-medium leading-tight">
          Module {state.currentModule}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center">
        <div className={`font-mono text-xl font-bold tabular-nums tracking-wider ${timerWarning ? "text-red-500" : "text-gray-800"}`}>
          {state.timerHidden ? "--:--" : timeStr}
        </div>
        <button
          onClick={() => dispatch({ type: "TOGGLE_TIMER" })}
          className="text-[10px] text-gray-400 hover:text-gray-600 cursor-pointer leading-none -mt-0.5"
        >
          {state.timerHidden ? "Show" : "Hide"}
        </button>
      </div>

      <div className="flex items-center gap-1 w-[200px] justify-end">
        {isMath && (
          <>
            <button onClick={onOpenCalc} className="flex flex-col items-center px-2 py-1 text-[10px] text-gray-600 hover:bg-gray-100 rounded-md transition-colors cursor-pointer">
              <svg className="w-4 h-4 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <line x1="4" y1="10" x2="20" y2="10" />
                <line x1="8" y1="14" x2="8" y2="18" />
                <line x1="12" y1="14" x2="12" y2="18" />
                <line x1="16" y1="14" x2="16" y2="18" />
                <line x1="8" y1="4" x2="8" y2="7" />
                <line x1="12" y1="4" x2="12" y2="7" />
                <line x1="16" y1="4" x2="16" y2="7" />
              </svg>
              Calculator
            </button>
            <button onClick={onOpenRef} className="flex flex-col items-center px-2 py-1 text-[10px] text-gray-600 hover:bg-gray-100 rounded-md transition-colors cursor-pointer">
              <svg className="w-4 h-4 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Ref Sheet
            </button>
          </>
        )}
        <button onClick={onOpenMore} className="flex flex-col items-center px-2 py-1 text-[10px] text-gray-600 hover:bg-gray-100 rounded-md transition-colors cursor-pointer">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="10" cy="4" r="1.5" /><circle cx="10" cy="10" r="1.5" /><circle cx="10" cy="16" r="1.5" />
          </svg>
        </button>
      </div>
    </header>
  );
}
