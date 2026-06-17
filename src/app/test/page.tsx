"use client";

import { useTest, TestProvider } from "@/lib/TestContext";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { FREE_TEST_IDS } from "@/lib/constants";
import { getUnfinishedTest } from "@/lib/unfinishedTestsStore";
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

          <div className="text-sm text-black space-y-1.5 mb-6 border border-black p-3 bg-notice-bg">
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
            className="w-full py-3 bg-continue text-black font-bold text-sm border border-gray-300 hover:bg-continue-hover cursor-pointer rounded-full"
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
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="flex items-start justify-between w-full max-w-4xl mx-auto px-10 gap-16" style={{ fontFamily: "Arial, sans-serif" }}>
        <div className="flex flex-col items-center gap-6 pt-8">
          <div className="bg-black rounded-2xl shadow-lg px-10 py-8 text-center">
            <p className="text-sm text-gray-400 mb-2">Remaining Break Time</p>
            <p className="text-5xl font-bold text-white tabular-nums tracking-wider">
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
            </p>
          </div>
          <button
            onClick={onEndBreak}
            className="px-10 py-3 bg-continue text-black font-bold text-sm rounded-full hover:bg-continue-hover cursor-pointer shadow-lg"
          >
            Resume Testing
          </button>
        </div>
        <div className="text-white pt-8 max-w-md space-y-4">
          <h2 className="text-2xl font-bold">Practice test break:</h2>
          <p className="text-sm leading-relaxed opacity-80">
            You can resume this practice test as soon as you are ready to move on. On the test day, you&rsquo;ll wait until the clock counts down. Read below to see how breaks work on the test day.
          </p>
          <hr className="border-white/30" />
          <p className="text-sm font-semibold">Take a Break, Do Not Close Your Device</p>
          <p className="text-sm leading-relaxed opacity-80">
            After the break, a Resume Testing Now button will appear and you will start the next section.
          </p>
          <p className="text-sm font-semibold mt-4">Follow these rules during the break:</p>
          <ol className="text-sm leading-relaxed opacity-80 list-decimal list-inside space-y-1">
            <li>Do not disturb students who are still testing</li>
            <li>Do not exit the app or close your laptop</li>
            <li>Do not access phones, smartwatches, textbooks, notes, or the internet</li>
            <li>Do not eat or drink near any testing device</li>
            <li>Do not speak in testing room; outside the room; do not discuss the exam with anyone</li>
          </ol>
        </div>
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lineReaderActive, setLineReaderActive] = useState(false);

  useEffect(() => {
    function handleChange() { setIsFullscreen(!!document.fullscreenElement); }
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }

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
        isMath={isMath}
        onOpenCalc={() => setShowCalc(true)}
        onOpenRef={() => setShowRef(true)}
        onOpenMore={() => setShowMore(!showMore)}
        onOpenHighlightPanel={() => setHighlightPanel(!highlightPanel)}
      />

      <div className="flex items-center justify-center shrink-0 bg-white">
        <span className="text-[11px] font-bold text-white bg-banner-bg px-6 uppercase tracking-wider rounded" style={{ width: "calc(100% - 48px)", maxWidth: "900px", textAlign: "center", lineHeight: "28px" }}>This is a practice test</span>
      </div>

      <AnnotationProvider>
        <div ref={splitRef} className="flex-1 flex overflow-hidden relative" style={{ cursor: dragging ? "col-resize" : undefined }}>
          {(currentQ.passage || currentQ.type === "gridin") && (
            <>
              <div className="overflow-hidden flex flex-col border-r border-gray-200 shrink-0" style={{ width: `${splitPos}%` }}>
                {currentQ.passage ? (
                  <PassagePanel
                    passage={currentQ.passage}
                    imageUrl={currentQ.passageImageUrl}
                    imageAlt={currentQ.passageImageAlt}
                    underlinedPart={currentQ.underlinedPart}
                    lineReaderActive={lineReaderActive}
                  />
                ) : (
                  <div className="flex-1 overflow-y-auto px-6 py-6 bg-white" style={{ fontFamily: "Arial, sans-serif" }}>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Student-Produced Response Directions</h2>
                    <div className="text-sm text-gray-800 space-y-3 leading-relaxed">
                      <p>If you find more than one correct answer, enter only one.</p>
                      <p>You can enter up to 5 characters for a positive answer and up to 6 characters for a negative answer (including the negative sign).</p>
                      <p>If your answer is a fraction that doesn&rsquo;t fit in the provided space, enter the decimal equivalent.</p>
                      <p>If your answer is a decimal that doesn&rsquo;t fit in the provided space, enter it by truncating or rounding at the fourth digit.</p>
                      <p>If your answer is a mixed number (such as 3<sup>1</sup>/<sub>2</sub>), enter it as an improper fraction (7/2) or its decimal equivalent (3.5).</p>
                      <p>Do not enter symbols such as a percent sign, comma, or dollar sign.</p>
                      <h3 className="font-bold text-gray-900 mt-4 mb-2">Examples</h3>
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-2 py-1 text-left">Answer</th>
                            <th className="border border-gray-300 px-2 py-1 text-left">Acceptable ways to enter answer</th>
                            <th className="border border-gray-300 px-2 py-1 text-left">Unacceptable: will NOT receive credit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            ["3.5", "3.5,  3.50,        7/2", "31/2,  3 1/2"],
                            ["2/3", "2/3,      .6666,         .66670,        .6660,          .667", "0.66,       .66,     0.67,     .67"],
                            ["-1/3", "-1/3,     -.3333,     -0.333", "-.33, -0.33"],
                          ].map((row, i) => (
                            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              {row.map((cell, j) => (
                                <td key={j} className="border border-gray-300 px-2 py-1 whitespace-pre-wrap">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
              <div
                className="w-1.5 bg-gray-100 border-l border-r border-gray-200 shrink-0 cursor-col-resize hover:bg-gray-300 flex items-center justify-center"
                onMouseDown={handleDividerMouseDown}
              >
                <div className="w-0.5 h-6 bg-gray-400" />
              </div>
            </>
          )}

          <div className={`overflow-hidden flex flex-col ${currentQ.passage || currentQ.type === "gridin" ? "" : "flex-1 max-w-2xl mx-auto"} ${isMath ? "bg-white" : "bg-panel-bg"}`} style={(currentQ.passage || currentQ.type === "gridin") ? { flex: `1 1 ${100 - splitPos}%` } : {}}>
            <div className={`flex items-center ${isMath ? "pl-0 pr-8" : "px-8"} py-2 ${isMath ? "bg-gray-100" : "bg-white"}`} style={{ borderBottom: "3px solid transparent", backgroundImage: "repeating-linear-gradient(to right, #000 0, #000 14px, transparent 14px, transparent 22px)", backgroundRepeat: "no-repeat", backgroundSize: "100% 3px", backgroundPosition: "bottom" }}>
              <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-900 text-white text-sm font-bold shrink-0">
                {currentQ.questionNumber}
              </div>
              {isMath && <div className="flex-1 h-8 bg-gray-200 ml-0" />}
              <button
                onClick={() => currentQ && dispatch({ type: "TOGGLE_REVIEW", questionId: currentQ.id })}
                className={`ml-3 inline-flex items-center justify-center gap-1.5 w-[130px] h-[30px] text-xs font-medium rounded-md cursor-pointer transition-colors shrink-0 ${
                  state.flaggedForReview.includes(currentQ.id) ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>{state.flaggedForReview.includes(currentQ.id) ? "Marked" : "Mark for Review"}</span>
              </button>
              {currentQ.type === "mcq" && (
                <button
                  onClick={() => setCrossOutMode(!crossOutMode)}
                  className="ml-auto inline-flex items-center justify-center gap-0.5 px-3 h-[26px] text-xs font-bold bg-primary text-white rounded-md cursor-pointer transition-colors shrink-0"
                >
                  <span className={crossOutMode ? "" : "line-through"}>A</span>
                  <span className={crossOutMode ? "" : "line-through"}>B</span>
                  <span className={crossOutMode ? "" : "line-through"}>C</span>
                </button>
              )}
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
                  <div className="mt-4 text-sm text-gray-600" style={{ fontFamily: "Arial, sans-serif" }}>
                    <span className="font-medium">Answer preview: </span>
                    <span className="text-gray-900 font-mono">{answered || "\u2014"}</span>
                  </div>
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
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        lineReaderActive={lineReaderActive}
        onLineReader={() => setLineReaderActive(!lineReaderActive)}
      />

      {showCalc && <Calculator onClose={() => setShowCalc(false)} />}
      {showRef && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowRef(false)} />
          <div className="fixed top-0 right-0 h-full z-50">
            <ReferenceSheet onClose={() => setShowRef(false)} />
          </div>
        </>
      )}

      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white border border-gray-200 p-5 max-w-sm mx-4 rounded-2xl" style={{ fontFamily: "Arial, sans-serif" }}>
            <h3 className="text-base font-bold text-gray-800 mb-2">Exit Test?</h3>
            <p className="text-sm text-gray-600 mb-5">Your progress for this module will be lost.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-2 border border-gray-200 text-gray-600 text-sm bg-white hover:bg-gray-50 cursor-pointer rounded-full">Cancel</button>
              <button onClick={() => router.push("/my-tests")} className="flex-1 py-2 text-white text-sm bg-primary hover:bg-primary-hover cursor-pointer rounded-full">Exit</button>
            </div>
          </div>
        </div>
      )}

      {state.section === "break" && state.breakTimer !== undefined && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="bg-black rounded-2xl shadow-lg px-10 py-8 text-center border border-gray-700">
            <p className="text-sm text-gray-400 mb-2">Remaining Break Time</p>
            <p className="text-4xl font-bold text-white mb-6 tabular-nums tracking-wider">
              {Math.floor(state.breakTimer / 60)}:{String(state.breakTimer % 60).padStart(2, "0")}
            </p>
            <button onClick={() => dispatch({ type: "RESUME_BREAK" })} className="px-10 py-3 bg-continue text-black font-bold text-sm rounded-full hover:bg-continue-hover cursor-pointer">Resume Testing</button>
          </div>
        </div>
      )}
    </div>
  );
}

function MoreMenu({ show, onClose, isMath, onCalc, onRef, onReview, onBreak, onExit, onToggleFullscreen, isFullscreen, lineReaderActive, onLineReader }: {
  show: boolean; onClose: () => void; isMath: boolean;
  onCalc: () => void; onRef: () => void;
  onReview: () => void; onBreak: () => void; onExit: () => void;
  onToggleFullscreen: () => void; isFullscreen: boolean;
  lineReaderActive: boolean; onLineReader: () => void;
}) {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showAssistiveTech, setShowAssistiveTech] = useState(false);

  if (!show) return null;
  return (
    <>
      {showShortcuts && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center">
          <div className="bg-white border border-gray-200 w-full max-w-xs mx-4 p-5 rounded-2xl shadow-lg" style={{ fontFamily: "Arial, sans-serif" }}>
            <h3 className="font-bold text-gray-800 text-base mb-3">Keyboard Shortcuts</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between"><span>Toggle Fullscreen</span><span className="text-gray-500 font-mono">F11 / f</span></div>
              <div className="flex justify-between"><span>Next Question</span><span className="text-gray-500 font-mono">Enter</span></div>
              <div className="flex justify-between"><span>Previous Question</span><span className="text-gray-500 font-mono">Shift+Enter</span></div>
              <div className="flex justify-between"><span>Mark for Review</span><span className="text-gray-500 font-mono">Ctrl+M</span></div>
              <div className="flex justify-between"><span>Cross-Out Mode</span><span className="text-gray-500 font-mono">Ctrl+Shift+X</span></div>
            </div>
            <button onClick={() => setShowShortcuts(false)} className="w-full mt-4 py-2 bg-primary text-white text-sm font-medium cursor-pointer rounded-full hover:bg-primary-hover">Close</button>
          </div>
        </div>
      )}
      {showHelp && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center">
          <div className="bg-white border border-gray-200 w-full max-w-sm mx-4 p-5 rounded-2xl shadow-lg" style={{ fontFamily: "Arial, sans-serif" }}>
            <h3 className="font-bold text-gray-800 text-base mb-3">Help</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p><strong>Navigation:</strong> Use the question grid at the bottom to jump between questions. Flag questions to review later.</p>
              <p><strong>Tools:</strong> Highlight text in the passage, add notes, or cross out answer options. Use the calculator and reference sheet for math sections.</p>
              <p><strong>Timer:</strong> Keep an eye on the timer. You can hide it using the button below the timer display.</p>
              <p><strong>Keyboard Shortcuts:</strong> Press <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 text-xs rounded">F11</kbd> or <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 text-xs rounded">f</kbd> for fullscreen, <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 text-xs rounded">Enter</kbd> for next question.</p>
            </div>
            <button onClick={() => setShowHelp(false)} className="w-full mt-4 py-2 bg-primary text-white text-sm font-medium cursor-pointer rounded-full hover:bg-primary-hover">Close</button>
          </div>
        </div>
      )}
      {showAssistiveTech && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center">
          <div className="bg-white border border-gray-200 w-full max-w-sm mx-4 p-5 rounded-2xl shadow-lg" style={{ fontFamily: "Arial, sans-serif" }}>
            <h3 className="font-bold text-gray-800 text-base mb-3">Assistive Technology</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p><strong>Line Reader:</strong> Use the Line Reader tool to highlight one line of text at a time as you read through passages. Toggle it from the More menu.</p>
              <p><strong>Keyboard Navigation:</strong> Use Tab to move between interactive elements. Press Enter or Space to activate buttons and selections.</p>
              <p><strong>Screen Reader:</strong> This application supports standard screen readers. Content is marked up with semantic HTML for compatibility.</p>
              <p><strong>Fullscreen:</strong> Use fullscreen mode to minimize distractions. Toggle with the More menu or press <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 text-xs rounded">F11</kbd>.</p>
            </div>
            <button onClick={() => setShowAssistiveTech(false)} className="w-full mt-4 py-2 bg-primary text-white text-sm font-medium cursor-pointer rounded-full hover:bg-primary-hover">Close</button>
          </div>
        </div>
      )}
      <div className="fixed right-4 top-[170px] bg-white border border-gray-200 z-50 min-w-[200px] rounded-lg shadow-lg" style={{ fontFamily: "Arial, sans-serif" }}>
        <button onClick={() => { onToggleFullscreen(); onClose(); }} className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {isFullscreen
              ? <><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></>
              : <><path strokeLinecap="round" strokeLinejoin="round" d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" /></>
            }
          </svg>
          {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        </button>
        {isMath && (
          <>
            <button onClick={() => { onRef(); onClose(); }} className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">Reference Sheet</button>
          </>
        )}
        <button onClick={() => { onReview(); onClose(); }} className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">Review</button>
        <button onClick={() => { onBreak(); onClose(); }} className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">Unscheduled Break</button>
        <div className="border-b border-gray-100" />
        <button onClick={() => { setShowHelp(true); onClose(); }} className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">Help</button>
        <button onClick={() => { setShowShortcuts(true); onClose(); }} className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">Keyboard Shortcuts</button>
        <button onClick={() => { setShowAssistiveTech(true); onClose(); }} className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">Assistive Technology</button>
        <button onClick={() => { onLineReader(); onClose(); }} className={`block w-full text-left px-4 py-2.5 text-sm border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-center gap-2 ${lineReaderActive ? "text-primary font-bold" : "text-gray-700"}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <line x1="3" y1="12" x2="21" y2="12" strokeWidth={3} />
            <line x1="3" y1="8" x2="21" y2="8" strokeWidth={0.5} />
            <line x1="3" y1="16" x2="21" y2="16" strokeWidth={0.5} />
          </svg>
          {lineReaderActive ? "Line Reader On" : "Line Reader"}
        </button>
        <button onClick={() => { onExit(); onClose(); }} className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50 cursor-pointer">Save &amp; Exit</button>
      </div>
    </>
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
  const resume = searchParams.get("resume") === "1";
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [accessChecked, setAccessChecked] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) { router.push("/sign-in"); return; }
    if (!resume && FREE_TEST_IDS.includes(mockId)) {
      setHasAccess(true);
      setAccessChecked(true);
      return;
    }
    if (resume) {
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
  }, [isLoaded, isSignedIn, mockId, router, resume]);

  useEffect(() => {
    if (!resume || !user) return;
    const email = user.emailAddresses?.[0]?.emailAddress || user.id || "";
    if (!email) return;
    const entry = getUnfinishedTest(email, mockId);
    if (entry) {
      sessionStorage.setItem("sat-test-state", JSON.stringify(entry.state));
    }
  }, [resume, user, mockId]);

  useEffect(() => {
    sessionStorage.removeItem("sat-test-results");
  }, [mockId]);

  if (!accessChecked || !hasAccess) {
    return <div className="min-h-screen bg-white flex items-center justify-center"><p className="text-gray-500">Checking access...</p></div>;
  }

  return (
    <TestProvider key={mockId} mockId={mockId} restore={resume}>
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
