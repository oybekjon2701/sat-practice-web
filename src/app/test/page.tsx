"use client";

import { useTest, TestProvider } from "@/lib/TestContext";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
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

      <div className="flex-1 flex overflow-hidden">
        {currentQ.passage && (
          <div className="w-1/2 overflow-hidden flex flex-col border-r border-black shrink-0">
            <PassagePanel
              passage={currentQ.passage}
              imageUrl={currentQ.passageImageUrl}
              imageAlt={currentQ.passageImageAlt}
              underlinedPart={currentQ.underlinedPart}
            />
          </div>
        )}

        <div className={`flex-1 flex flex-col overflow-hidden bg-white ${currentQ.passage ? "" : "max-w-2xl mx-auto"}`}>
          <div className="flex-1 overflow-y-auto px-4 py-3">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-bold text-black" style={{ fontFamily: "Arial, sans-serif" }}>{currentQ.questionNumber}</span>
              <button
                onClick={() => currentQ && dispatch({ type: "TOGGLE_REVIEW", questionId: currentQ.id })}
                className={`text-xs cursor-pointer ${
                  state.flaggedForReview.includes(currentQ.id)
                    ? "text-red-600 font-bold"
                    : "text-black underline"
                }`}
                style={{ fontFamily: "Arial, sans-serif" }}
              >
                {state.flaggedForReview.includes(currentQ.id) ? "✓ Marked for Review" : "Mark for Review"}
              </button>
              {currentQ.type === "gridin" && (
                <span className="text-xs text-black border border-black px-1" style={{ fontFamily: "Arial, sans-serif" }}>Student-produced response</span>
              )}
            </div>

            {currentQ.imageUrl && (
              <div className="mb-3">
                <img src={currentQ.imageUrl} alt={currentQ.imageAlt || "Figure"} className="max-w-[240px] max-h-[180px] h-auto border border-black" />
              </div>
            )}

            <div className="text-base leading-relaxed text-black mb-6 whitespace-pre-line" style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.5" }}>
              {renderMath(currentQ.stem)}
            </div>

            {currentQ.type === "mcq" && currentQ.choices && (
              <div className="space-y-1.5 max-w-xl">
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
        <div className="fixed right-4 top-12 bg-white border border-black z-50 min-w-[150px]" style={{ fontFamily: "Arial, sans-serif" }}>
          {isMath && (
            <>
              <button onClick={() => { setShowCalc(true); setShowMore(false); }} className="block w-full text-left px-3 py-2 text-sm text-black border-b border-black hover:bg-[#f0f2f5] cursor-pointer">
                Calculator
              </button>
              <button onClick={() => { setShowRef(true); setShowMore(false); }} className="block w-full text-left px-3 py-2 text-sm text-black border-b border-black hover:bg-[#f0f2f5] cursor-pointer">
                Reference Sheet
              </button>
            </>
          )}
          <button onClick={() => { dispatch({ type: "SHOW_REVIEW" }); setShowMore(false); }} className="block w-full text-left px-3 py-2 text-sm text-black border-b border-black hover:bg-[#f0f2f5] cursor-pointer">
            Review
          </button>
          <button onClick={() => { dispatch({ type: "UNSCHEDULED_BREAK" }); setShowMore(false); }} className="block w-full text-left px-3 py-2 text-sm text-black border-b border-black hover:bg-[#f0f2f5] cursor-pointer">
            Unscheduled Break
          </button>
          <button onClick={() => { setShowMore(false); setShowExitConfirm(true); }} className="block w-full text-left px-3 py-2 text-sm text-black hover:bg-[#f0f2f5] cursor-pointer">
            Exit Test
          </button>
        </div>
      )}

      {showCalc && <Calculator onClose={() => setShowCalc(false)} />}
      {showRef && <ReferenceSheet onClose={() => setShowRef(false)} />}

      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white border border-black p-5 max-w-sm mx-4" style={{ fontFamily: "Arial, sans-serif" }}>
            <h3 className="text-base font-bold text-black mb-2">Exit Test?</h3>
            <p className="text-sm text-black mb-5">Your progress for this module will be lost. You can start a new test anytime.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-2 border border-black text-black text-sm bg-white hover:bg-[#f0f2f5] cursor-pointer">
                Cancel
              </button>
              <button onClick={() => router.push("/my-tests")} className="flex-1 py-2 border border-black text-white text-sm bg-black hover:bg-[#333] cursor-pointer">
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {state.section === "break" && state.breakTimer !== undefined && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white border border-black p-6 max-w-sm mx-4 text-center" style={{ fontFamily: "Arial, sans-serif" }}>
            <h3 className="text-base font-bold text-black mb-1">Break</h3>
            <p className="text-sm text-black mb-5">Timer is paused. Come back when you&apos;re ready.</p>
            <button
              onClick={() => dispatch({ type: "RESUME_BREAK" })}
              className="w-full py-2 border border-black bg-black text-white text-sm hover:bg-[#333] cursor-pointer"
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
