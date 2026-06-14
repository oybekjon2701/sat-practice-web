"use client";

import { useTest, TestProvider } from "@/lib/TestContext";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { FREE_TEST_IDS } from "@/lib/constants";
import TestHeader from "@/components/TestHeader";
import PassagePanel from "@/components/PassagePanel";
import AnswerChoice from "@/components/AnswerChoice";
import GridIn from "@/components/GridIn";
import NavigationPanel from "@/components/NavigationPanel";
import Calculator from "@/components/Calculator";
import ReferenceSheet from "@/components/ReferenceSheet";
import ModuleReviewScreen from "@/components/ModuleReviewScreen";
import ModuleTransitionScreen from "@/components/ModuleTransitionScreen";
import HighlightsPanel from "@/components/HighlightsPanel";
import { AnnotationProvider } from "@/lib/AnnotationContext";
import { renderMath } from "@/lib/renderMath";

function Directions({ onStart }: { onStart: () => void }) {
  const { state } = useTest();
  const isReading = state.currentSection === "reading";

  function handleStart() {
    try { document.documentElement.requestFullscreen(); } catch (_) {}
    onStart();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white border border-gray-200 w-full max-w-lg mx-4 rounded-2xl" style={{ fontFamily: "Arial, sans-serif" }}>
        <div className="p-6">
          <h1 className="text-lg font-bold text-black mb-1">
            {isReading ? "Reading and Writing" : "Math"} — Module 1
          </h1>
          <p className="text-sm text-black mb-4">
            {state.modules[0].questions.length} questions
          </p>

          <div className="text-sm text-black space-y-1.5 mb-6 border border-black p-3 bg-[#f0f2f5]">
            {isReading ? (
              <>
                <p>• Each passage or paired set is followed by one or more questions.</p>
                <p>• Read each passage carefully and select the best answer for each question.</p>
                <p>• You may flag questions for review and return to them later.</p>
              </>
            ) : (
              <>
                <p>• You may use a calculator for all math questions.</p>
                <p>• Some questions require you to enter your answer in a grid-in box.</p>
                <p>• A reference sheet of formulas is available during the test.</p>
              </>
            )}
            <p>• You will have {isReading ? "32" : "35"} minutes to complete this module.</p>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-3 bg-[#e8b800] text-black font-bold text-sm border border-gray-300 hover:bg-[#d4a600] cursor-pointer rounded-full"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function BreakScreen({ onEndBreak }: { onEndBreak: () => void }) {
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white border border-gray-200 w-full max-w-sm mx-4 p-6 text-center rounded-2xl" style={{ fontFamily: "Arial, sans-serif" }}>
        <h1 className="text-lg font-bold text-black mb-2">Break</h1>
        <p className="text-sm text-black mb-5">
          Take a short break. The next section will begin automatically.
        </p>
        <div className="text-3xl font-bold text-black mb-5 tabular-nums">
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
        </div>
        <button
          onClick={onEndBreak}
          className="w-full py-3 bg-[#e8b800] text-black font-bold text-sm border border-gray-300 hover:bg-[#d4a600] cursor-pointer rounded-full"
        >
          {timeLeft > 0 ? "Skip Break" : "Start Math Section"}
        </button>
      </div>
    </div>
  );
}

function TestContent() {
  const { state, dispatch } = useTest();
  const router = useRouter();
  const [showCalc, setShowCalc] = useState(false);
  const [showRef, setShowRef] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [crossOutMode, setCrossOutMode] = useState(false);
  const [highlightPanel, setHighlightPanel] = useState(false);

  const currentMod = state.modules[0];
  const currentQ = currentMod?.questions[state.currentQuestionIndex];
  const isMath = state.currentSection === "math";

  useEffect(() => {
    if (state.section !== "testing") return;
    const id = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(id);
  }, [state.section, dispatch]);

  useEffect(() => {
    if (state.timeRemaining <= 0 && state.section === "testing") {
      dispatch({ type: "END_MODULE" });
    }
  }, [state.timeRemaining, state.section, dispatch]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "F11" || e.key === "f") {
        e.preventDefault();
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.documentElement.requestFullscreen();
        }
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  if (!currentQ) return null;

  const answered = state.answers[currentQ.id] ?? "";
  const crossedOut = state.crossedOut[currentQ.id] || [];

  const splitRef = useRef<HTMLDivElement>(null);
  const [splitPos, setSplitPos] = useState(50);
  const [dragging, setDragging] = useState(false);

  const handleDividerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    function onMouseMove(e: MouseEvent) {
      if (!splitRef.current) return;
      const rect = splitRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitPos(Math.max(20, Math.min(80, pct)));
    }
    function onMouseUp() { setDragging(false); }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => { document.removeEventListener("mousemove", onMouseMove); document.removeEventListener("mouseup", onMouseUp); };
  }, [dragging]);

  return (
    <div className="h-screen flex flex-col bg-white">
      <TestHeader
        onOpenCalc={() => setShowCalc(true)}
        onOpenRef={() => setShowRef(true)}
        onOpenMore={() => setShowMore(!showMore)}
        onOpenHighlightPanel={() => setHighlightPanel(!highlightPanel)}
      />

      <div className="flex items-center justify-center shrink-0 bg-white">
        <span className="text-[11px] font-bold text-white bg-[#1a4972] px-6 uppercase tracking-wider rounded" style={{ width: "calc(100% - 48px)", maxWidth: "900px", textAlign: "center", lineHeight: "28px" }}>This is a practice test</span>
      </div>

      <AnnotationProvider>
        <div ref={splitRef} className="flex-1 flex overflow-hidden relative" style={{ cursor: dragging ? "col-resize" : undefined }}>
          {currentQ.passage && (
            <>
              <div className="overflow-hidden flex flex-col border-r border-gray-200 shrink-0" style={{ width: `${splitPos}%` }}>
                <PassagePanel
                  passage={currentQ.passage}
                  imageUrl={currentQ.passageImageUrl}
                  imageAlt={currentQ.passageImageAlt}
                  underlinedPart={currentQ.underlinedPart}
                />
              </div>
              <div
                className="w-1.5 bg-gray-100 border-l border-r border-gray-200 shrink-0 cursor-col-resize hover:bg-gray-300 flex items-center justify-center"
                onMouseDown={handleDividerMouseDown}
              >
                <div className="w-0.5 h-6 bg-gray-400" />
              </div>
            </>
          )}

          <div className={`overflow-hidden flex flex-col bg-[#fafafa] ${currentQ.passage ? "" : "flex-1 max-w-2xl mx-auto"}`} style={currentQ.passage ? { flex: `1 1 ${100 - splitPos}%` } : {}}>
            <div className="flex items-center gap-3 px-8 py-2 bg-white" style={{ borderBottom: "3px solid transparent", backgroundImage: "repeating-linear-gradient(to right, #000 0, #000 14px, transparent 14px, transparent 22px)", backgroundRepeat: "no-repeat", backgroundSize: "100% 3px", backgroundPosition: "bottom" }}>
              <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-900 text-white text-sm font-bold">
                {currentQ.questionNumber}
              </div>
              <button
                onClick={() => currentQ && dispatch({ type: "TOGGLE_REVIEW", questionId: currentQ.id })}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer transition-colors ${
                  state.flaggedForReview.includes(currentQ.id) ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                {state.flaggedForReview.includes(currentQ.id) ? "Marked" : "Mark for Review"}
              </button>
              <button
                onClick={() => setCrossOutMode(!crossOutMode)}
                className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer transition-colors ${
                  crossOutMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span className={crossOutMode ? "" : "line-through"}>A</span>
                <span className={crossOutMode ? "" : "line-through"}>B</span>
                <span className={crossOutMode ? "" : "line-through"}>C</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6">
              {currentQ.imageUrl && (
                <div className="mb-4">
                  <img src={currentQ.imageUrl} alt={currentQ.imageAlt || "Figure"} className="max-w-[240px] max-h-[180px] h-auto border border-gray-300" />
                </div>
              )}

              <div className="text-base leading-relaxed text-gray-800 mb-5 whitespace-pre-line" style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
                {renderMath(currentQ.stem)}
              </div>

              {currentQ.type === "mcq" && currentQ.choices && (
                <div className="space-y-3 max-w-xl">
                  {currentQ.choices.map((c) => (
                    <AnswerChoice
                      key={c.label}
                      label={c.label}
                      text={c.text}
                      selected={answered === c.label}
                      crossedOut={crossedOut.includes(c.label)}
                      showCrossOut={crossOutMode}
                      onSelect={() =>
                        dispatch({
                          type: "ANSWER_QUESTION",
                          questionId: currentQ.id,
                          answer: c.label,
                        })
                      }
                    onCrossOut={() => { if (crossOutMode) dispatch({ type: "CROSS_OUT", questionId: currentQ.id, label: c.label }); }}
                    />
                  ))}
                </div>
              )}

              {currentQ.type === "gridin" && (
                <div className="max-w-md">
                  <GridIn
                    value={answered}
                    onChange={(val) =>
                      dispatch({
                        type: "ANSWER_QUESTION",
                        questionId: currentQ.id,
                        answer: val,
                      })
                    }
                  />
                </div>
              )}
            </div>
            <div className="border-t border-gray-200" />
          </div>
        </div>

        {highlightPanel && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setHighlightPanel(false)} />
            <div className="absolute top-0 right-0 h-full z-50">
              <HighlightsPanel onClose={() => setHighlightPanel(false)} />
            </div>
          </>
        )}
      </AnnotationProvider>

      <NavigationPanel />

      {showMore && <div className="fixed inset-0 z-40" onClick={() => setShowMore(false)} />}
      <MoreMenu
        show={showMore}
        onClose={() => setShowMore(false)}
        isMath={isMath}
        onCalc={() => setShowCalc(true)}
        onRef={() => setShowRef(true)}
        onReview={() => { dispatch({ type: "SHOW_REVIEW" }); setShowMore(false); }}
        onBreak={() => { dispatch({ type: "UNSCHEDULED_BREAK" }); setShowMore(false); }}
        onExit={() => { setShowMore(false); setShowExitConfirm(true); }}
      />

      {showCalc && <Calculator onClose={() => setShowCalc(false)} />}
      {showRef && <ReferenceSheet onClose={() => setShowRef(false)} />}

      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white border border-gray-200 p-5 max-w-sm mx-4 rounded-2xl" style={{ fontFamily: "Arial, sans-serif" }}>
            <h3 className="text-base font-bold text-gray-800 mb-2">Exit Test?</h3>
            <p className="text-sm text-gray-600 mb-5">Your progress for this module will be lost.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-2 border border-gray-200 text-gray-600 text-sm bg-white hover:bg-gray-50 cursor-pointer rounded-full">Cancel</button>
              <button onClick={() => router.push("/my-tests")} className="flex-1 py-2 text-white text-sm bg-[#0033aa] hover:bg-[#002288] cursor-pointer rounded-full">Exit</button>
            </div>
          </div>
        </div>
      )}

      {state.section === "break" && state.breakTimer !== undefined && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white border border-gray-200 p-6 max-w-sm mx-4 text-center rounded-2xl" style={{ fontFamily: "Arial, sans-serif" }}>
            <h3 className="text-base font-bold text-gray-800 mb-1">Break</h3>
            <p className="text-sm text-gray-600 mb-5">Timer is paused.</p>
            <button onClick={() => dispatch({ type: "RESUME_BREAK" })} className="w-full py-2 bg-[#0033aa] text-white text-sm hover:bg-[#002288] cursor-pointer rounded-full">Resume Test</button>
          </div>
        </div>
      )}
    </div>
  );
}

function MoreMenu({ show, onClose, isMath, onCalc, onRef, onReview, onBreak, onExit }: {
  show: boolean; onClose: () => void; isMath: boolean;
  onCalc: () => void; onRef: () => void;
  onReview: () => void; onBreak: () => void; onExit: () => void;
}) {
  if (!show) return null;
  return (
    <div className="fixed right-4 top-[108px] bg-white border border-gray-200 z-50 min-w-[200px] rounded-lg shadow-lg" style={{ fontFamily: "Arial, sans-serif" }}>
      {isMath && (
        <>
          <button onClick={() => { onCalc(); onClose(); }} className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">Calculator</button>
          <button onClick={() => { onRef(); onClose(); }} className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">Reference Sheet</button>
        </>
      )}
      <button onClick={() => { onReview(); onClose(); }} className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">Review</button>
      <button onClick={() => { onBreak(); onClose(); }} className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">Unscheduled Break</button>
      <div className="border-b border-gray-100" />
      <button onClick={() => { onClose(); }} className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">Help</button>
      <button onClick={() => { onClose(); }} className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">Keyboard Shortcuts</button>
      <button onClick={() => { onClose(); }} className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">Assistive Technology</button>
      <button onClick={() => { onClose(); }} className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">Line Reader</button>
      <button onClick={() => { onExit(); onClose(); }} className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50 cursor-pointer">Save &amp; Exit</button>
    </div>
  );
}

function TestPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mockId = searchParams.get("mockId") || "mock-1";
  const { state, dispatch } = useTest();

  useEffect(() => {
    if (state.section === "results") {
      router.push("/results");
    }
  }, [state.section, router]);

  if (state.section === "directions") {
    return <Directions onStart={() => dispatch({ type: "START_TEST" })} />;
  }

  if (state.section === "review") {
    return <ModuleReviewScreen />;
  }

  if (state.section === "transition") {
    return <ModuleTransitionScreen />;
  }

  if (state.section === "break" && state.breakTimer === undefined) {
    return <BreakScreen onEndBreak={() => dispatch({ type: "END_BREAK" })} />;
  }

  return <TestContent />;
}

function TestPageWrapper() {
  const searchParams = useSearchParams();
  const mockId = searchParams.get("mockId") || "mock-1";
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [accessChecked, setAccessChecked] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) { router.push("/sign-in"); return; }
    if (FREE_TEST_IDS.includes(mockId)) {
      setHasAccess(true);
      setAccessChecked(true);
      return;
    }
    fetch("/api/check-premium")
      .then((r) => r.json())
      .then((d) => {
        setHasAccess(d.premium);
        setAccessChecked(true);
        if (!d.premium) router.push("/pricing");
      });
  }, [isLoaded, isSignedIn, mockId, router]);

  useEffect(() => {
    sessionStorage.removeItem("sat-test-results");
  }, [mockId]);

  if (!accessChecked || !hasAccess) {
    return <div className="min-h-screen bg-white flex items-center justify-center"><p className="text-gray-500">Checking access...</p></div>;
  }

  return (
    <TestProvider key={mockId} mockId={mockId}>
      <TestPageInner />
    </TestProvider>
  );
}

export default function TestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>}>
      <TestPageWrapper />
    </Suspense>
  );
}
