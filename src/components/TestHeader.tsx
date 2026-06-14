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
    <header className="h-10 bg-[#f0f2f5] border-b border-black flex items-center px-3 shrink-0 z-40" style={{ fontFamily: "Arial, sans-serif" }}>
      <div className="w-[200px]">
        <span className="text-xs text-black font-semibold">{sectionLabel} · Module {state.currentModule}</span>
      </div>
      <div className="flex-1 flex justify-center">
        <span className={`text-lg font-bold tabular-nums tracking-wider ${timerWarning ? "text-red-600" : "text-black"}`} style={{ fontFamily: "Arial, sans-serif" }}>
          {state.timerHidden ? "--:--" : timeStr}
        </span>
      </div>
      <div className="flex items-center gap-3 w-[200px] justify-end">
        {isMath && (
          <>
            <button onClick={onOpenCalc} className="text-xs text-black underline cursor-pointer">Calculator</button>
            <button onClick={onOpenRef} className="text-xs text-black underline cursor-pointer">Reference</button>
          </>
        )}
        <button onClick={onOpenMore} className="text-xs text-black underline cursor-pointer">More</button>
      </div>
    </header>
  );
}
