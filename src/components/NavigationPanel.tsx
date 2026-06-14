"use client";

import { useTest } from "@/lib/TestContext";
import { useState } from "react";
import { Question } from "@/types";

function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center">
      <div className="bg-white border border-black w-full max-w-sm mx-4 p-6 text-center" style={{ fontFamily: "Arial, sans-serif" }}>
        <p className="text-black font-semibold mb-4 text-sm">{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onCancel} className="px-5 py-2 text-sm border border-black hover:bg-[#f0f2f5] cursor-pointer text-black bg-white">Cancel</button>
          <button onClick={onConfirm} className="px-5 py-2 text-sm bg-black text-white hover:bg-[#333] cursor-pointer font-medium border border-black">Confirm</button>
        </div>
      </div>
    </div>
  );
}

function QuestionGrid({ questions, onClose }: { questions: Question[]; onClose: () => void }) {
  const { state, dispatch } = useTest();
  const [showConfirm, setShowConfirm] = useState(false);

  function handleSubmit() {
    if (state.currentSection === "math" && state.currentModule > 1) {
      dispatch({ type: "SHOW_REVIEW" });
    } else {
      setShowConfirm(true);
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-16">
      {showConfirm && (
        <ConfirmDialog
          message="Are you sure you want to submit this module? Unanswered questions will be marked as skipped."
          onConfirm={() => { dispatch({ type: "END_MODULE" }); setShowConfirm(false); }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      <div className="bg-white border border-black w-full max-w-lg mx-4 p-5" style={{ fontFamily: "Arial, sans-serif" }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-black text-sm">Check Your Work</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-6 gap-1.5 mb-4">
          {questions.map((q, idx) => {
            const answered = state.answers[q.id] !== undefined && state.answers[q.id] !== "";
            const flagged = state.flaggedForReview.includes(q.id);
            const isCurrent = idx === state.currentQuestionIndex;
            return (
              <button
                key={q.id}
                onClick={() => { dispatch({ type: "GO_TO_QUESTION", index: idx }); onClose(); }}
                className={`h-9 text-xs font-medium cursor-pointer border ${
                  isCurrent ? "border-[#0033aa] border-2" : ""
                } ${
                  flagged ? "bg-red-50 text-red-600 border-red-300" : answered ? "bg-[#0033aa] text-white border-[#0033aa]" : "bg-white text-black border-gray-300"
                }`}
              >
                {q.questionNumber}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 text-[10px] text-black border-t border-black pt-3 mb-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#0033aa]" />Answered
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-white border border-gray-300" />Unanswered
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-2.5 h-2.5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M5 2h10l-3 6 3 6H5l3-6-3-6z" /></svg>For Review
          </div>
        </div>

        <button onClick={handleSubmit} className="w-full py-2 bg-[#0033aa] text-white font-semibold text-sm hover:bg-[#002288] cursor-pointer border border-[#0033aa]">
          Review All &amp; Submit
        </button>
      </div>
    </div>
  );
}

interface Props {
  crossOutMode?: boolean;
  onToggleCrossOut?: () => void;
}

export default function NavigationPanel({ crossOutMode, onToggleCrossOut }: Props) {
  const { state, dispatch } = useTest();
  const [showGrid, setShowGrid] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const currentMod = state.modules[0];
  const questions = currentMod?.questions ?? [];
  const totalQ = questions.length;
  const isFirst = state.currentQuestionIndex === 0;
  const isLast = state.currentQuestionIndex >= totalQ - 1;

  return (
    <>
      {showSubmitConfirm && (
        <ConfirmDialog
          message="Are you sure you want to submit this module? Unanswered questions will be marked as skipped."
          onConfirm={() => { dispatch({ type: "END_MODULE" }); setShowSubmitConfirm(false); }}
          onCancel={() => setShowSubmitConfirm(false)}
        />
      )}
      <div className="h-9 bg-[#edf2fa] border-t border-black flex items-center px-3 justify-between shrink-0" style={{ fontFamily: "Arial, sans-serif" }}>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-black font-medium">{state.userName || "Student"}</span>
        </div>

        <button
          onClick={() => setShowGrid(true)}
          className="px-3 py-0.5 bg-black text-white text-xs font-bold cursor-pointer border border-black"
        >
          Question {isNaN(state.currentQuestionIndex + 1) ? "?" : state.currentQuestionIndex + 1} of {totalQ}
        </button>

        <button
          onClick={() => {
            if (isLast) {
              if (state.currentSection === "math" && state.currentModule > 1) {
                dispatch({ type: "SHOW_REVIEW" });
              } else {
                setShowSubmitConfirm(true);
              }
            } else {
              dispatch({ type: "NEXT_QUESTION" });
            }
          }}
          className="px-4 py-0.5 text-xs bg-[#0033aa] text-white hover:bg-[#002288] cursor-pointer font-semibold border border-[#0033aa]"
        >
          {isLast ? "Submit" : "Next"}
        </button>
      </div>

      {showGrid && <QuestionGrid questions={questions} onClose={() => setShowGrid(false)} />}
    </>
  );
}
