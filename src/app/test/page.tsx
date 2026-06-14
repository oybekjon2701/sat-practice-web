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
import { renderMath } from "@/lib/renderMath";

function Directions({ onStart }: { onStart: () => void }) {
  const { state } = useTest();
  const isReading = state.currentSection === "reading";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-lg mx-4 p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {isReading ? "Reading and Writing" : "Math"} — Module 1
          </h1>
          <p className="text-gray-500 text-sm">
            {isReading ? `${state.modules[0].questions.length} questions` : `${state.modules[0].questions.length} questions`}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-gray-600 space-y-2">
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
          onClick={onStart}
          className="w-full py-3 bg-[#1a73e8] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Continue
        </button>
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
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md mx-4 p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Break</h1>
        <p className="text-gray-500 text-sm mb-6">
          Take a short break. The next section will begin automatically.
        </p>
        <div className="text-4xl font-mono font-bold text-[#1a73e8] mb-6">
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
        </div>
        <button
          onClick={onEndBreak}
          className="w-full py-3 bg-[#1a73e8] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
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
  const [leftWidth, setLeftWidth] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleMouseDown = useCallback(() => {
    setDragging(true);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setLeftWidth(Math.min(75, Math.max(25, pct)));
    };
    const handleMouseUp = () => setDragging(false);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  if (!currentQ) return null;

  const answered = state.answers[currentQ.id] ?? "";
  const crossedOut = state.crossedOut[currentQ.id] || [];

  return (
    <div className="h-screen flex flex-col bg-white">
      <TestHeader
        onOpenCalc={() => setShowCalc(true)}
        onOpenRef={() => setShowRef(true)}
        onOpenMore={() => setShowMore(!showMore)}
      />

      <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
        {currentQ.passage && (
          <>
            <div className="overflow-hidden flex flex-col border-r border-gray-200" style={{ width: `${leftWidth}%` }}>
              <PassagePanel
                passage={currentQ.passage}
                imageUrl={currentQ.passageImageUrl}
                imageAlt={currentQ.passageImageAlt}
                underlinedPart={currentQ.underlinedPart}
              />
            </div>

            <div
              className={`w-1.5 bg-gray-200 hover:bg-[#1a73e8] cursor-col-resize shrink-0 relative transition-colors ${dragging ? "bg-[#1a73e8]" : ""}`}
              onMouseDown={handleMouseDown}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-6 bg-gray-400 rounded-full" />
            </div>
          </>
        )}

        <div className={`flex-1 flex flex-col overflow-hidden ${currentQ.passage ? "" : "max-w-2xl mx-auto"}`}>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-base font-bold text-gray-800">{currentQ.questionNumber}</span>
              <button
                onClick={() => currentQ && dispatch({ type: "TOGGLE_REVIEW", questionId: currentQ.id })}
                className={`text-xs flex items-center gap-1 px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  state.flaggedForReview.includes(currentQ.id)
                    ? "text-red-600 bg-red-50"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                <svg className="w-3.5 h-3.5" fill={state.flaggedForReview.includes(currentQ.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
                Mark for Review
              </button>
              {currentQ.type === "gridin" && (
                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">Student-produced response</span>
              )}
            </div>

            {currentQ.imageUrl && (
              <div className="mb-3 flex justify-center">
                <img src={currentQ.imageUrl} alt={currentQ.imageAlt || "Figure"} className="max-w-[240px] max-h-[180px] h-auto rounded-lg border border-gray-200" />
              </div>
            )}

            <h2 className="text-base leading-relaxed text-gray-800 mb-6 whitespace-pre-line">
              {renderMath(currentQ.stem)}
            </h2>

            {currentQ.type === "mcq" && currentQ.choices && (
              <div className="space-y-2 max-w-xl">
                {currentQ.choices.map((c) => (
                  <AnswerChoice
                    key={c.label}
                    label={c.label}
                    text={c.text}
                    selected={answered === c.label}
                    crossedOut={crossedOut.includes(c.label)}
                    onSelect={() =>
                      dispatch({
                        type: "ANSWER_QUESTION",
                        questionId: currentQ.id,
                        answer: c.label,
                      })
                    }
                    onCrossOut={() =>
                      dispatch({
                        type: "CROSS_OUT",
                        questionId: currentQ.id,
                        label: c.label,
                      })
                    }
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
        </div>
      </div>

      <NavigationPanel />

      {showMore && (
        <div className="fixed right-4 top-16 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 min-w-[140px]">
          {isMath && (
            <>
              <button onClick={() => { setShowCalc(true); setShowMore(false); }} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded cursor-pointer">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
              <button onClick={() => { setShowRef(true); setShowMore(false); }} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded cursor-pointer">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Reference Sheet
              </button>
            </>
          )}
          <button onClick={() => { dispatch({ type: "SHOW_REVIEW" }); setShowMore(false); }} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            Review
          </button>
          <button onClick={() => { dispatch({ type: "UNSCHEDULED_BREAK" }); setShowMore(false); }} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Unscheduled Break
          </button>
          <button onClick={() => { setShowMore(false); setShowExitConfirm(true); }} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Exit Test
          </button>
        </div>
      )}

      {showCalc && <Calculator onClose={() => setShowCalc(false)} />}
      {showRef && <ReferenceSheet onClose={() => setShowRef(false)} />}

      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Exit Test?</h3>
            <p className="text-sm text-slate-500 mb-6">Your progress for this module will be lost. You can start a new test anytime.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 cursor-pointer">
                Cancel
              </button>
              <button onClick={() => router.push("/my-tests")} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 cursor-pointer">
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {state.section === "break" && state.breakTimer !== undefined && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm mx-4 text-center">
            <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#0d9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Break</h3>
            <p className="text-sm text-slate-500 mb-6">Timer is paused. Come back when you&apos;re ready.</p>
            <button
              onClick={() => dispatch({ type: "RESUME_BREAK" })}
              className="w-full py-2.5 bg-[#0d9488] text-white rounded-lg text-sm font-bold hover:bg-[#0f766e] transition-colors cursor-pointer"
            >
              Resume Test
            </button>
          </div>
        </div>
      )}
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
